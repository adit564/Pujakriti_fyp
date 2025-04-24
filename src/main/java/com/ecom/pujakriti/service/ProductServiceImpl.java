package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.BundleImage;
import com.ecom.pujakriti.entity.Category;
import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.entity.ProductImage;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.EditProductRequest;
import com.ecom.pujakriti.model.ProductResponse;
import com.ecom.pujakriti.repository.CategoryRepository;
import com.ecom.pujakriti.repository.ProductImageRepository;
import com.ecom.pujakriti.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;


@Service
@Log4j2
public class ProductServiceImpl implements ProductService {


    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    public ProductResponse getProductById(Integer id) {
        log.info("Fetching product with id {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        log.info("Product fetched successfully");
        return convertToProductResponse(product);
    }

    private final Path imageStorageLocation = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/product_img");


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

    @Override
    public Product createProduct(Product product) {
        log.info("Creating a new product: {}", product.getName());
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getProductId());
        return savedProduct;
    }

    @Override
    public ProductResponse updateProduct(Integer id, EditProductRequest request) {
        Optional<Product> existingProductOptional = productRepository.findById(id);
        if (!existingProductOptional.isPresent()) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        Product existingProduct = existingProductOptional.get();

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStock(request.getStock());

        if (request.getCategoryId() != null) {
            Optional<Category> categoryOptional = categoryRepository.findById(request.getCategoryId());
            categoryOptional.ifPresent(existingProduct::setCategory);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToProductResponse(updatedProduct);
    }


    @Override
    @Transactional // Ensure both deletions happen in a single transaction
    public void deleteProduct(Integer id) throws ProductNotFoundException {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        Product product = productOptional.get();

        List<ProductImage> productImages = productImageRepository.findByProduct(product);
        for (ProductImage productImage : productImages) {
            Path imagePathToDelete = imageStorageLocation.resolve(productImage.getImageUrl());
            try {
                if (Files.exists(imagePathToDelete)) {
                    log.info("Deleting Product image file: {}", imagePathToDelete);
                    Files.delete(imagePathToDelete);
                } else {
                    log.warn("Product image file not found: {}", imagePathToDelete);
                }
                productImageRepository.delete(productImage); // Delete the database record
            } catch (IOException e) {
                log.error("Error deleting Product image file {}: {}", imagePathToDelete, e.getMessage(), e);
            }
        }


        // Now delete the Product
        productRepository.delete(product);
    }

    @Override
    public ProductResponse convertToProductResponse(Product product) {
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
