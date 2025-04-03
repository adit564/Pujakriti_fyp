package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private User user;
    private Double totalAmount;
    private Address address;
    private Order.OrderStatus status;
    private DiscountCode discountCode;
    private LocalDateTime orderDate;
    private List<OrderItem> orderItems;
    private Payment payment;

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }
}
