package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse getProductById(Long id);

    List<ProductResponse> getProducts();
}
