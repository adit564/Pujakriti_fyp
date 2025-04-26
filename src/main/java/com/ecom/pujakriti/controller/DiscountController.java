package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.DiscountCodeRequest;
import com.ecom.pujakriti.model.DiscountCodeResponse;
import com.ecom.pujakriti.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping("/active")
    public ResponseEntity<List<DiscountCodeResponse>> activeDiscounts() {
        List<DiscountCodeResponse> discountCodeResponses = discountService.getActiveDiscounts();
        return new ResponseEntity<>(discountCodeResponses,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<DiscountCodeResponse>> allDiscounts() {
        List<DiscountCodeResponse> discountCodeResponses = discountService.getAllDiscounts();
        return new ResponseEntity<>(discountCodeResponses,HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DiscountCodeResponse> addDiscountCode(@RequestBody DiscountCodeRequest discountCodeRequest) {
        DiscountCodeResponse addedDiscount = discountService.addDiscountCode(discountCodeRequest);
        return new ResponseEntity<>(addedDiscount, HttpStatus.CREATED);
    }

    @GetMapping("/{discountId}")
    public ResponseEntity<DiscountCodeResponse> getDiscountCodeById(@PathVariable Integer discountId) {

        try{
            DiscountCodeResponse discountCode = discountService.getDiscountCodeById(discountId);
            return ResponseEntity.ok(discountCode);
        }catch (ProductNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PutMapping("/{discountId}")
    public ResponseEntity<DiscountCodeResponse> updateDiscountCode(@PathVariable Integer discountId, @RequestBody DiscountCodeRequest discountCodeRequest) {
        try {
            DiscountCodeResponse updatedDiscount = discountService.updateDiscountCode(discountId, discountCodeRequest);
            return new ResponseEntity<>(updatedDiscount, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{discountId}")
    public ResponseEntity<Void> deleteDiscountCode(@PathVariable Integer discountId) {
        discountService.deleteDiscountCode(discountId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
