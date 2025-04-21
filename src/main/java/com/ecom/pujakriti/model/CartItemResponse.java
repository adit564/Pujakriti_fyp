package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Integer cartItemId;

    private Integer productId;

    private Integer bundleId;

    private Integer quantity;

    private Double price;
}
