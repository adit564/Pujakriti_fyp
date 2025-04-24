package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.EditProductRequest;
import com.ecom.pujakriti.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ProductService {

    ProductResponse getProductById(Integer id);

    Page<ProductResponse> getProducts(Pageable pageable, Integer categoryId, String keyword);

    Product createProduct(Product product);

    ProductResponse convertToProductResponse(Product product);

    List<Product> searchProducts(String keyword);

    ProductResponse updateProduct(Integer id, EditProductRequest request);

    void deleteProduct(Integer id) throws ProductNotFoundException;

}
