package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Integer reviewId;
    private User user;

    private Product product;

    private Bundle bundle;

    private Integer rating;

    private LocalDateTime reviewDate;
}
