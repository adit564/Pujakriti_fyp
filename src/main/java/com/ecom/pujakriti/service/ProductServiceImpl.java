package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.ProductResponse;
import com.ecom.pujakriti.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;


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
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        log.info("Product fetched successfully");
        return convertToProductResponse(product);
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable , Integer categoryId, String keyword) {
        log.info("Fetching products");
        Specification<Product> spec = Specification.where(null);


        if(categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("categoryId"), categoryId));
        }

        if(keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + keyword + "%"));
        }

        return productRepository.findAll(spec,pageable).map(this::convertToProductResponse);

    }

    @Override
    public List<Product> searchProducts(String keyword) {

        return null;
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory().getName())
                .stock(product.getStock())
                .build();
    }




}
