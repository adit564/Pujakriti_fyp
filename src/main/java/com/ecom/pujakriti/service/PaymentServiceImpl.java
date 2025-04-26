package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.*;
import com.ecom.pujakriti.model.PaymentResponse;
import com.ecom.pujakriti.repository.*;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.xhtmlrenderer.pdf.ITextRenderer;
import com.vladsch.flexmark.util.ast.Node;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service("paymentService")
@Log4j2
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository; // Need to fetch OrderItems

    @Autowired
    private EmailService emailService;

    @Autowired
    private GuideRepository guideRepository;


    public List<PaymentResponse> getAllPayments(String status) {
        List<Payment> payments;
        if (status != null && !status.isEmpty()) {
            log.info("Filtering payments by status: {}", status);
            payments = paymentRepository.findByStatus(Payment.PaymentStatus.valueOf(status)); // Assuming you have a findByStatusIgnoreCase method
        } else {
            log.info("Retrieving all payments");
            payments = paymentRepository.findAll();
        }
        return payments.stream()
                .map(this::convertToPaymentResponse) // and this
                .collect(Collectors.toList());
    }
    private PaymentResponse convertToPaymentResponse(Payment payment){
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrder().getOrderId())
                .userId(payment.getUser().getUserId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .build();
    }


    private static final String ESEWA_UAT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    private static final String MERCHANT_CODE = "EPAYTEST";
    private static final String SECRET_KEY = "8gBm/:&EnhH.1/q";

    @Transactional
    public String initiatePayment(Integer orderId, String amount) {
        log.info("Initiating payment for orderId: {}, amount: {}", orderId, amount);
        try {
            // Validate order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

            Payment payment = paymentRepository.findByOrder_OrderId(orderId).orElse(null);

            if (payment == null) {
                // Create new payment record
                payment = new Payment();
                payment.setOrder(order);
                payment.setUser(order.getUser());
                payment.setAmount(Double.parseDouble(amount));
                payment.setStatus(Payment.PaymentStatus.PENDING);
                payment.setPaymentDate(LocalDateTime.now());
                payment.setTransactionId(UUID.randomUUID().toString());
                paymentRepository.save(payment);
                order.setPayment(payment);
                log.info("Created new payment record for orderId: {}, paymentId: {}, transactionId: {}", orderId, payment.getPaymentId(), payment.getTransactionId());
            } else {
                // Payment record exists
                log.info("Payment record found for orderId: {}, paymentId: {}, status: {}", orderId, payment.getPaymentId(), payment.getStatus());
                if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                    log.warn("Payment already completed for orderId: {}", orderId);
                    throw new IllegalStateException("Payment already completed for this order.");
                }
                // For PENDING or FAILED, update the existing record
                payment.setStatus(Payment.PaymentStatus.PENDING);
                payment.setPaymentDate(LocalDateTime.now());
                payment.setTransactionId(UUID.randomUUID().toString()); // Generate new transaction ID for retry
                paymentRepository.save(payment);
                log.info("Updated existing payment record for orderId: {}, paymentId: {}, new transactionId: {}", orderId, payment.getPaymentId(), payment.getTransactionId());
            }

            String formattedAmount = String.format("%.2f", Double.parseDouble(amount)).replace(",", "");
            String totalAmount = formattedAmount;
            String transactionUuid = payment.getTransactionId(); // Use the transaction ID from the Payment object

            String successUrl = String.format(
                    "https://localhost:3000/payment-verify?status=success&oid=%s&amt=%s&refId=%s",
                    URLEncoder.encode(orderId.toString(), StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(amount, StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode("ESEWA_REF_" + transactionUuid.substring(0, 8), StandardCharsets.UTF_8.toString())
            );
            String failureUrl = String.format(
                    "https://localhost:3000/payment-verify?status=failed&oid=%s&amt=%s&refId=%s",
                    URLEncoder.encode(orderId.toString(), StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(amount, StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode("ESEWA_REF_" + transactionUuid.substring(0, 8), StandardCharsets.UTF_8.toString())
            );

            String signedFieldNames = "total_amount,transaction_uuid,product_code";
            String signatureData = "total_amount=" + totalAmount + ",transaction_uuid=" + transactionUuid + ",product_code=" + MERCHANT_CODE;
            String signature = generateHmacSignature(signatureData, SECRET_KEY);

            String form = "<form id='esewaForm' action='" + ESEWA_UAT_URL + "' method='POST'>" +
                    "<input type='hidden' name='amount' value='" + formattedAmount + "'>" +
                    "<input type='hidden' name='total_amount' value='" + totalAmount + "'>" +
                    "<input type='hidden' name='transaction_uuid' value='" + transactionUuid + "'>" +
                    "<input type='hidden' name='product_code' value='" + MERCHANT_CODE + "'>" +
                    "<input type='hidden' name='success_url' value='" + successUrl + "'>" +
                    "<input type='hidden' name='failure_url' value='" + failureUrl + "'>" +
                    "<input type='hidden' name='signed_field_names' value='" + signedFieldNames + "'>" +
                    "<input type='hidden' name='signature' value='" + signature + "'>" +
                    "<input type='hidden' name='product_service_charge' value='0'>" +
                    "<input type='hidden' name='product_delivery_charge' value='0'>" +
                    "<input type='hidden' name='tax_amount' value='0'>" +
                    "</form>";

            log.info("Generated eSewa form for orderId: {}, transactionUuid: {}, form: {}", orderId, transactionUuid, form);
            return form;

        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to initiate payment for orderId: {}", orderId, e);
            throw new RuntimeException("Payment initiation failed: " + e.getMessage(), e);
        }
    }

    public String generateHmacSignature(String data, String secretKey) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    @Transactional
    public PaymentResponse verifyPayment(String orderId, String amount, String transactionId) {
        log.info("Verifying payment for orderId: {}, amount: {}, transactionId: {}", orderId, amount, transactionId);
        try {
            Integer orderIdInt = Integer.parseInt(orderId);
            Payment payment = paymentRepository.findByOrder_OrderId(orderIdInt)
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found for order: " + orderId));
            log.info("Retrieved payment for orderId: {}", orderIdInt);

            if (amount == null || transactionId == null) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setPaymentDate(LocalDateTime.now());
                Order order = orderRepository.findById(orderIdInt)
                        .orElseThrow(() -> new IllegalArgumentException("Order not found for orderId: " + orderIdInt));
                order.setStatus(Order.OrderStatus.CANCELLED);
                orderRepository.save(order);
                paymentRepository.save(payment);
                log.info("Payment failed for orderId: {}, amount: {}, transactionId: {}", orderId, amount, transactionId);
            } else {
                payment.setTransactionId(transactionId);
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setAmount(Double.parseDouble(amount));
                payment.setPaymentDate(LocalDateTime.now());

                paymentRepository.save(payment);
                log.info("Payment updated: orderId={}, status={}", orderId, payment.getStatus());

                // **START: Guide Retrieval and Email Sending After Successful Payment**
                Order order = orderRepository.findById(orderIdInt)
                        .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderIdInt));
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                List<Guide> guidesToSend = orderItems.stream()
                        .filter(item -> item.getBundle() != null && item.getProduct() == null)
                        .map(OrderItem::getBundle)
                        .filter(bundle -> bundle.getPuja() != null)
                        .map(Bundle::getPuja)
                        .flatMap(puja -> guideRepository.findByPuja(puja).stream()) // Use the repository to find guides by Puja
                        .filter(java.util.Objects::nonNull)
                        .distinct() // To avoid sending the same guide multiple times if multiple bundles point to the same Puja
                        .collect(Collectors.toList());

                if (!guidesToSend.isEmpty()) {
                    for (Guide guide : guidesToSend) {
                        byte[] pdfBytes = generatePdfFromMarkdown(guide.getContent(), guide.getName());
                        emailService.sendOrderConfirmationEmailWithAttachment(
                                order.getUser().getEmail(),
                                "Your Order Confirmation and Puja Guide",
                                "Thank you for your order! Please find the guide for '" + guide.getName() + "' attached.",
                                guide.getName() + ".pdf",
                                pdfBytes
                        );
                    }
                    log.info("Sent {} guides for orderId: {}", guidesToSend.size(), orderIdInt);
                }
                // **END: Guide Retrieval and Email Sending**
            }

            return PaymentResponse.builder()
                    .paymentId(payment.getPaymentId())
                    .orderId(payment.getOrder().getOrderId())
                    .userId(payment.getUser().getUserId())
                    .transactionId(payment.getTransactionId())
                    .amount(payment.getAmount())
                    .status(payment.getStatus())
                    .paymentDate(payment.getPaymentDate())
                    .build();
        } catch (Exception e) {
            log.error("Failed to verify payment for orderId: {}", orderId, e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage(), e);
        }
    }

    private byte[] generatePdfFromMarkdown(String markdownContent, String guideName) {
        try {
            // 1. Parse Markdown to HTML
            ITextRenderer pdfRenderer = new ITextRenderer();
            Parser parser = Parser.builder().build();
            com.vladsch.flexmark.util.ast.Node document = parser.parse(markdownContent);
            HtmlRenderer renderer = HtmlRenderer.builder()
                    .escapeHtml(true) // Ensure HTML special characters are escaped
                    // Try enabling these extensions that might produce more XHTML-like output
                    .extensions(java.util.Arrays.asList(
                            com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension.create(),
                            com.vladsch.flexmark.ext.tables.TablesExtension.create(),
                            com.vladsch.flexmark.ext.autolink.AutolinkExtension.create()
                            // Add other extensions you might be using
                    ))
                    .build();
            String htmlContent = renderer.render(document);
            String xhtmlContent = "<html xmlns=\"http://www.w3.org/1999/xhtml\">" +
                    "<head>" +
                    "<title>" + guideName + "</title>" + // Optional title
                    "</head>" +
                    "<body>" +
                    htmlContent +
                    "</body>" +
                    "</html>";
            pdfRenderer.setDocumentFromString(xhtmlContent);
            pdfRenderer.layout();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            pdfRenderer.createPDF(outputStream);

            log.info("Successfully generated PDF for guide: {}", guideName);
            return outputStream.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF for guide: {}", guideName, e);
            return new byte[0]; // Return an empty byte array in case of an error
        }
    }


}