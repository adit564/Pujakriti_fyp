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
    private Integer orderId;
    private Integer userId;
    private Double totalAmount;
    private Integer address;
    private Order.OrderStatus status;
    private Integer discountCodeId;
    private LocalDateTime orderDate;
    private List<OrderItem> orderItems;
    private Integer paymentID;

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }
}
