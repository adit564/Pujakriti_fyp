package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.*;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.AddressResponse;
import com.ecom.pujakriti.model.AdminOrdersResponse;
import com.ecom.pujakriti.model.OrderResponse;
import com.ecom.pujakriti.model.OrdersResponse;
import com.ecom.pujakriti.repository.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class OrderServiceImpl implements OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private DiscountCodeRepository discountRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private  BundleRepository bundleRepository;

    @Transactional
    public OrderResponse createOrder(Integer userId, Integer addressId, String cartId, String discountCode) {
        log.info("Starting order creation for userId: {}, addressId: {}, cartId: {}, discountCode: {}",
                userId, addressId, cartId, discountCode);

        // Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        log.info("User found: {}", user.getUserId());

        // Validate address
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found: " + addressId));
        if (!address.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to user");
        }
        log.info("Address found: {}", addressId);

        // Validate cart
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found: " + cartId));
        if (cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        // Check if cart is already used
        if (orderRepository.findByCartId(cartId).isPresent()) {
            throw new IllegalStateException("Cart already used for an order: " + cartId);
        }
        log.info("Cart found with {} items", cart.getCartItems().size());

        // Validate discount
        Double discountRate = 0.0;
        Integer discountCodeId = null;
        if (discountCode != null) {
            DiscountCode discount = discountRepository.findByCode(discountCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid discount code: " + discountCode));
            if (!discount.getIsActive() || discount.getExpiryDate().isBefore(ChronoLocalDate.from(LocalDateTime.now()))) {
                throw new IllegalArgumentException("Discount code expired: " + discountCode);
            }
            discountRate = discount.getDiscountRate();
            discountCodeId = discount.getDiscountId();
            log.info("Discount applied: {} with rate {}", discountCode, discountRate);
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(calculateTotal(cart, discountRate));
        order.setCartId(cartId); // Store cartId
        if (discountCodeId != null) {
            order.setDiscountCode(discountRepository.findById(discountCodeId).orElse(null));
        }
        log.info("Order created with total: {}", order.getTotalAmount());

        // Create order items
        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> {
            log.info("Processing CartItem: id={}, productId={}, bundleId={}, quantity={}, price={}",
                    cartItem.getId(), cartItem.getProductId(), cartItem.getBundleId(), cartItem.getQuantity(), cartItem.getPrice());

            if ((cartItem.getProductId() == null && cartItem.getBundleId() == null) ||
                    (cartItem.getProductId() != null && cartItem.getBundleId() != null)) {
                throw new IllegalArgumentException(
                        "CartItem must have exactly one of productId or bundleId: id=" + cartItem.getId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            if (cartItem.getProductId() != null) {
                Product product = productRepository.findById(cartItem.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found: " + cartItem.getProductId()));
                orderItem.setProduct(product);
            }
            if (cartItem.getBundleId() != null) {
                Bundle bundle = bundleRepository.findById(cartItem.getBundleId())
                        .orElseThrow(() -> new IllegalArgumentException("Bundle not found: " + cartItem.getBundleId()));
                orderItem.setBundle(bundle);
            }
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            return orderItem;
        }).collect(Collectors.toList());
        log.info("Created {} order items", orderItems.size());

        // Save entities
        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);
        log.info("Order and items saved");

        // Clear cart
        cartRepository.delete(cart);
        log.info("Cart cleared: {}", cartId);

        // Map OrderItems to OrderItemDTO
        List<OrderResponse.OrderItemDTO> orderItemDTOs = orderItems.stream().map(item -> OrderResponse.OrderItemDTO.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProduct() != null ? item.getProduct().getProductId() : null)
                .bundleId(item.getBundle() != null ? item.getBundle().getBundleId() : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build()).collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(userId)
                .address(addressId)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .discountCodeId(discountCodeId)
                .orderDate(order.getOrderDate())
                .orderItems(orderItemDTOs)
                .build();
    }

    private double calculateTotal(Cart cart, double discountRate) {
        double total = cart.getCartItems().stream()
                .mapToDouble(item -> {
                    if (item.getPrice() == null || item.getQuantity() == null) {
                        log.error("Invalid CartItem: id={}, productId={}, bundleId={}, price={}, quantity={}",
                                item.getId(), item.getProductId(), item.getBundleId(), item.getPrice(), item.getQuantity());
                        throw new IllegalArgumentException("Invalid CartItem: price or quantity is null for id=" + item.getId());
                    }
                    return item.getPrice() * item.getQuantity();
                })
                .sum();
        return total * (1 - discountRate);
    }

    @Override
    public List<OrdersResponse> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUser_UserId((userId)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminOrdersResponse> getAllOrdersForAdmin() {
        log.info("Getting all orders from repository");
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderResponse)
                .toList();
    }

    @Override
    public OrderResponse updateOrderStatus(Integer orderId, String newStatus) {
        log.info("Updating order {} status to {}", orderId, newStatus);
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new ProductNotFoundException("Order not found with id: " + orderId);
        }
        Order order = orderOptional.get();
        try {
            order.setStatus(Order.OrderStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            log.error("Invalid order status: {}", newStatus, e);
            throw new IllegalArgumentException("Invalid order status: " + newStatus);
        }
        Order updatedOrder = orderRepository.save(order);
        return convertToOrderRes(updatedOrder); // use the conversion method.
    }

    private OrderResponse convertToOrderRes(Order order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .totalAmount(order.getTotalAmount())
                .address(order.getAddress().getAddressId())
                .status(order.getStatus())
                .discountCodeId(order.getDiscountCode().getDiscountId())
                .orderDate(order.getOrderDate())
                .orderItems(order.getOrderItems().stream()
                        .map(this::convertOrderItemsToRes)
                        .collect(Collectors.toList())
                ) //and this
                .paymentID(order.getPayment().getPaymentId())
                .build();
    }
    private OrderResponse.OrderItemDTO convertOrderItemsToRes(OrderItem orderItem) {
        Integer productId= null;
        Integer bundleId = null;
        if (orderItem.getProduct() != null) {
            productId = orderItem.getProduct().getProductId();
        } else if (orderItem.getBundle() != null) {
            bundleId = orderItem.getBundle().getBundleId();
        }
        return OrderResponse.OrderItemDTO.builder()
                .orderItemId(orderItem.getOrderItemId())
                .productId(productId)
                .bundleId(bundleId)
                .build();
    }


    private AdminOrdersResponse convertToOrderResponse(Order order) {
        return AdminOrdersResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .userName(order.getUser().getName())
                .totalAmount(order.getTotalAmount())
                .address(order.getAddress().getCity() + " " + order.getAddress().getStreet() + " " + order.getAddress().getState())
                .status(order.getStatus())
                .discountCode(order.getDiscountCode().getCode())
                .discountRate(order.getDiscountCode().getDiscountRate())
                .orderDate(order.getOrderDate())
                .orderItems(order.getOrderItems().stream()
                        .map(this::convertOrderItemsToDTO)
                        .collect(Collectors.toList())
                ) //and this
                .paymentID(order.getPayment().getPaymentId())
                .build();
    }

    private AdminOrdersResponse.AdminOrderItemDTO convertOrderItemsToDTO(OrderItem orderItem) {
        String productName = "";
        String bundleName = "";
        if (orderItem.getProduct() != null) {
            productName = orderItem.getProduct().getName();
        } else if (orderItem.getBundle() != null) {
            bundleName = orderItem.getBundle().getName();
        }

        return AdminOrdersResponse.AdminOrderItemDTO.builder()
                .orderItemId(orderItem.getOrderItemId())
                .productName(productName)
                .bundleName(bundleName)
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();

    }

    private OrdersResponse mapToResponse(Order order) {
        return OrdersResponse.builder()
                .orderId(order.getOrderId())
                .totalAmount(order.getTotalAmount())
                .addressState(order.getAddress().getState())
                .addressCity(order.getAddress().getCity())
                .addressStreet(order.getAddress().getStreet())
                .status(String.valueOf(order.getStatus()))
                .discountCode(order.getDiscountCode().getCode())
                .discountRate(order.getDiscountCode().getDiscountRate())
                .orderDate(order.getOrderDate())
                .orderItems(
                        order.getOrderItems().stream()
                                .map(this::mapToOrdersItemDTO)
                                .collect(Collectors.toList())
                )
                .transactionId(order.getPayment().getTransactionId())
                .build();
    }

    private OrdersResponse.OrdersItemDTO mapToOrdersItemDTO(OrderItem orderItem) {
        String productName = "";
        String bundleName = "";
        if (orderItem.getProduct() != null) {
            productName = orderItem.getProduct().getName();
        } else if (orderItem.getBundle() != null) {
            bundleName = orderItem.getBundle().getName();
        }

        return OrdersResponse.OrdersItemDTO.builder()
                .orderItemId(orderItem.getOrderItemId())
                .productName(productName)
                .bundleName(bundleName)
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }

}