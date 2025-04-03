package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiscountCodeResponse {
    private Long discountId;
    private String code;
    private Double discountRate;
    private Boolean isActive;
    private LocalDate expiryDate;
}
