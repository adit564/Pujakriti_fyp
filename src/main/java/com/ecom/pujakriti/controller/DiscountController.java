package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.model.DiscountCodeResponse;
import com.ecom.pujakriti.service.DiscountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<DiscountCodeResponse>> activeDiscounts() {
        List<DiscountCodeResponse> discountCodeResponses = discountService.getActiveDiscounts();
        return new ResponseEntity<>(discountCodeResponses,HttpStatus.OK);
    }

}
