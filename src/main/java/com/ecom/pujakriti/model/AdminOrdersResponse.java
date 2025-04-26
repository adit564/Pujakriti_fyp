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
public class AdminOrdersResponse {

    private Integer orderId;
    private Integer userId;
    private String userName;
    private Double totalAmount;
    private String address;
    private Order.OrderStatus status;
    private String discountCode;
    private double discountRate;
    private LocalDateTime orderDate;
    private List<AdminOrdersResponse.AdminOrderItemDTO> orderItems;
    private Integer paymentID;

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AdminOrderItemDTO {
        private Integer orderItemId;
        private String productName;
        private String bundleName;
        private Integer quantity;
        private Double price;
    }

}
