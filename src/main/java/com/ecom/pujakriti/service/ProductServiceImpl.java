package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.model.ProductResponse;
import com.ecom.pujakriti.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Log4j2
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse getProductById(Integer id) {
        log.info("Fetching product with id {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        log.info("Product fetched successfully");
        return convertToProductResponse(product);
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable) {
        log.info("Fetching products");

//      Fetch Products
        Page<Product> productPage = productRepository.findAll(pageable);

//        Stream Operator to map with Response

        Page<ProductResponse> productResponses = productPage
                .map(this::convertToProductResponse);
        log.info("Products fetched successfully");

        return productResponses;
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory().getName())
                .build();
    }
}
