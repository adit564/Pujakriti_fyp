package com.ecom.pujakriti.controller;

import com.ecom.pujakriti.model.OrderResponse;
import com.ecom.pujakriti.service.OrderService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return new ResponseEntity<>(orderResponse.getOrderId(), HttpStatus.CREATED); // Return only the orderId
            // Alternatively, if you prefer to return the entire OrderResponse:
            // return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
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





}