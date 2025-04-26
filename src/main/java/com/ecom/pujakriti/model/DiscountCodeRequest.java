package com.ecom.pujakriti.model;


import lombok.Data;

import java.time.LocalDate;

@Data
public class DiscountCodeRequest {
    private String code;
    private Double discountRate;
    private Boolean isActive;
    private LocalDate expiryDate;
}