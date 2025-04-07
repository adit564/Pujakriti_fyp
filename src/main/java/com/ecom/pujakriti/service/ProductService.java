package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductResponse getProductById(Integer id);

    Page<ProductResponse> getProducts(Pageable pageable);
}
