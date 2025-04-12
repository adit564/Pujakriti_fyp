package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Integer productId;

    private String name;

    private String description;

    private Double price;

    private String category;

    private Integer stock;

}
