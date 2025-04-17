package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.Order;
import com.ecom.pujakriti.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {

    private Integer orderItemId;

    private Order order;

    private Product product;

    private Bundle bundle;

    private Integer quantity;

    private Double price;

}
