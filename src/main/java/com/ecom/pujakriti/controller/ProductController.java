package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.model.CategoryResponse;
import com.ecom.pujakriti.model.ProductResponse;
import com.ecom.pujakriti.service.CategoryService;
import com.ecom.pujakriti.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    private final CategoryService categoryService;

    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer id ) {
        ProductResponse productResponse = productService.getProductById(id);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<ProductResponse> productResponses = productService.getProducts(pageable);
        return new ResponseEntity<>(productResponses,HttpStatus.OK);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> categoryResponses = categoryService.getCategories();
        return new ResponseEntity<>(categoryResponses,HttpStatus.OK);
    }

}
