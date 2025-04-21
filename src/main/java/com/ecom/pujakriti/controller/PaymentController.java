package com.ecom.pujakriti.controller;

import com.ecom.pujakriti.model.PaymentResponse;
import com.ecom.pujakriti.model.StatusResponse;
import com.ecom.pujakriti.service.PaymentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import org.json.JSONObject;


@RestController
@RequestMapping("/api/payments")
@Log4j2
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping(value = "/initiate", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<?> initiatePayment(
            @RequestParam Integer orderId,
            @RequestParam String amount) {
        log.info("Initiating payment for orderId: {}, amount: {}", orderId, amount);
        try {
            String paymentForm = paymentService.initiatePayment(orderId, amount);
            log.info("Payment form generated for orderId: {}", orderId);
            return new ResponseEntity<>(paymentForm, HttpStatus.OK);
        } catch (IllegalStateException e) { // Specific catch for the exception from the service
            log.warn("Payment initiation conflict for orderId: {}", orderId, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // Return 409 with the message
        } catch (Exception e) {
            log.error("Failed to initiate payment for orderId: {}", orderId, e);
            return new ResponseEntity<>("Failed to initiate payment. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestParam(value = "orderId", required = false) String orderId,
            @RequestParam(value = "oid", required = false) String oid,
            @RequestParam(value = "data", required = false) String data,
            @RequestParam(value = "amt", required = false) String amount,
            @RequestParam(value = "refId", required = false) String transactionId,
            @RequestParam(value = "status", defaultValue = "success") String status,
            @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
            @RequestParam Map<String, String> allParams) {
        log.info("Verifying payment for orderId: {}, oid: {}, status: {}, data: {}, amount: {}, transactionId: {}, originalUri: {}, allParams: {}",
                orderId, oid, status, data, amount, transactionId, originalUri, allParams);

        try {
            // Use oid as fallback
            if (orderId == null && oid != null) {
                orderId = oid;
                log.info("Using oid as orderId: {}", orderId);
            }

            String actualTransactionId = transactionId;
            String eSewaData = data;

            // Check if data is within the refId
            if (transactionId != null && transactionId.contains("?data=")) {
                int dataIndex = transactionId.indexOf("?data=");
                actualTransactionId = transactionId.substring(0, dataIndex);
                eSewaData = transactionId.substring(dataIndex + "?data=".length());
                log.info("Extracted actualTransactionId from refId: {}", actualTransactionId);
                log.info("Extracted eSewaData from refId: {}", eSewaData);
            }

            if (orderId == null) {
                log.error("Missing required parameter: orderId or oid");
                return ResponseEntity.badRequest().body(new StatusResponse("FAILED", "Missing required parameter: orderId or oid"));
            }

            // Handle failed status
            if ("failed".equalsIgnoreCase(status)) {
                log.warn("Processing failed payment for orderId: {}, data: {}", orderId, eSewaData);
                paymentService.verifyPayment(orderId, null, null);
                return ResponseEntity.badRequest().body(new StatusResponse("FAILED", "Payment failed"));
            }

            // Handle eSewa callback with data
            if (eSewaData == null) {
                log.error("Missing required parameter: data for successful transaction, orderId={}", orderId);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new StatusResponse("ERROR", "Missing required parameter: data"));
            }

            // Decode and parse data
            String decodedData = new String(Base64.getDecoder().decode(eSewaData));
            JSONObject jsonData = new JSONObject(decodedData);
            String transactionIdFromData = jsonData.getString("transaction_code");
            String amountFromData = jsonData.getString("total_amount").replace(",", "");
            String transactionStatus = jsonData.getString("status");
            String signedFieldNames = jsonData.getString("signed_field_names");
            String signature = jsonData.getString("signature");

            // Verify signature
            String signatureData = String.join("",
                    "transaction_code=", transactionIdFromData,
                    ",status=", transactionStatus,
                    ",total_amount=", amountFromData,
                    ",transaction_uuid=", jsonData.getString("transaction_uuid"),
                    ",product_code=", jsonData.getString("product_code"),
                    ",signed_field_names=", signedFieldNames);
            String expectedSignature = paymentService.generateHmacSignature(signatureData, "8gBm/:&EnhH.1/q");
            log.info("Signature data: {}, Expected signature: {}, Received signature: {}", signatureData, expectedSignature, signature);
            if (!signature.equals(expectedSignature)) {
                log.error("Invalid signature for orderId: {}", orderId);
                return ResponseEntity.badRequest().body(new StatusResponse("FAILED", "Invalid transaction signature"));
            }

            // Verify status
            if (!"COMPLETE".equalsIgnoreCase(transactionStatus)) {
                log.error("Transaction not completed for orderId: {}, status: {}", orderId, transactionStatus);
                return ResponseEntity.badRequest().body(new StatusResponse("FAILED", "Transaction not completed: " + transactionStatus));
            }

            // Call verifyPayment
            PaymentResponse paymentResponse = paymentService.verifyPayment(orderId, amountFromData, transactionIdFromData);
            log.info("Payment verified: {}", paymentResponse);

            return ResponseEntity.ok(new StatusResponse("COMPLETED", "Payment verification successful"));

        } catch (Exception e) {
            log.error("Failed to verify payment for orderId: {}", orderId, e);
            return ResponseEntity.internalServerError().body(new StatusResponse("ERROR", "Failed to verify payment: " + e.getMessage()));
        }
    }


}