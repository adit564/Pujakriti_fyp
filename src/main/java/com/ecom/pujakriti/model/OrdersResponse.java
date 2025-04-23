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
public class OrdersResponse {
    private Integer orderId;
    private Double totalAmount;
    private String addressCity;
    private String addressStreet;
    private String addressState;
    private String status;
    private String discountCode;
    private double discountRate;
    private LocalDateTime orderDate;
    private List<OrdersResponse.OrdersItemDTO> orderItems;
    private String transactionId;



    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrdersItemDTO {
        private Integer orderItemId;
        private String productName;
        private String bundleName;
        private Integer quantity;
        private Double price;
    }

}

