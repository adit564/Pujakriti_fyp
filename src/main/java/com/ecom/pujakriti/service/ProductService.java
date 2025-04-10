package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponse getProductById(Integer id);

    Page<ProductResponse> getProducts(Pageable pageable, Integer categoryId, String keyword);

}
