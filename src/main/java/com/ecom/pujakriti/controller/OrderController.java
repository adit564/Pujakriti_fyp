package com.ecom.pujakriti.controller;

import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.AdminOrdersResponse;
import com.ecom.pujakriti.model.OrderResponse;
import com.ecom.pujakriti.model.OrdersResponse;
import com.ecom.pujakriti.service.OrderService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Log4j2
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestParam Integer userId,
            @RequestParam Integer addressId,
            @RequestParam String cartId,
            @RequestParam(required = false) String discountCode) {
        log.info("Creating order with userId: {}, addressId: {}, cartId: {}, discountCode: {}",
                userId, addressId, cartId, discountCode);
        try {
            OrderResponse orderResponse = orderService.createOrder(userId, addressId, cartId, discountCode);
            log.info("Order created with ID: {}", orderResponse.getOrderId());
            return new ResponseEntity<>(orderResponse.getOrderId(), HttpStatus.CREATED);
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Failed to create order: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to create order for userId: {}, addressId: {}, cartId: {}, discountCode: {}",
                    userId, addressId, cartId, discountCode, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create order: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrdersResponse>> getOrdersByUserId(@PathVariable Integer userId) {
            return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }


    @GetMapping
    public ResponseEntity<List<AdminOrdersResponse>> getAllOrders() {
        log.info("Fetching all orders for admin");
        List<AdminOrdersResponse> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }


    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New status cannot be empty."));
        }
        try {
            log.info("Updating order status for orderId: {} to status: {}", orderId, newStatus);
            OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (ProductNotFoundException e) {
            log.error("Order not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Invalid order status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

}