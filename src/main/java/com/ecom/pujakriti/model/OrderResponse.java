package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.Order;
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
    private List<OrderItemDTO> orderItems;
    private Integer paymentID;

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemDTO {
        private Integer orderItemId;
        private Integer productId;
        private Integer bundleId;
        private Integer quantity;
        private Double price;
    }
}