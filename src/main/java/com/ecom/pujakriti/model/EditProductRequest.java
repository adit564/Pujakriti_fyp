package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Integer categoryId;
}