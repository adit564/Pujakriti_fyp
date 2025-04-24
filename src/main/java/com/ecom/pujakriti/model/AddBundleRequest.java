package com.ecom.pujakriti.model;

import lombok.Data;

@Data
public class AddBundleRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private AddPujaRequest puja;
    private AddGuideRequest guide;
}