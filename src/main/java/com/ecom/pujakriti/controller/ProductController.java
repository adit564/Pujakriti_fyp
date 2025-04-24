package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.Category;
import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.CategoryResponse;
import com.ecom.pujakriti.model.CreateProductRequest;
import com.ecom.pujakriti.model.EditProductRequest;
import com.ecom.pujakriti.model.ProductResponse;
import com.ecom.pujakriti.repository.CategoryRepository;
import com.ecom.pujakriti.repository.ProductRepository;
import com.ecom.pujakriti.service.CategoryService;
import com.ecom.pujakriti.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    private final CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;


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
           @RequestParam(name = "page", defaultValue = "0") int page,
           @RequestParam(name = "size", defaultValue = "10") int size,
           @RequestParam(name = "keyword", required = false) String keyword,
           @RequestParam(name = "category", required = false) Integer CategoryId,
           @RequestParam(name = "sort", defaultValue = "productId") String sort,
           @RequestParam(name = "order", defaultValue = "asc") String order

    ) {
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortOrder = Sort.by(direction,sort);
        Pageable pageable = PageRequest.of(page,size,sortOrder);
        Page<ProductResponse> productResponses = productService.getProducts(pageable,CategoryId,keyword);
        return new ResponseEntity<>(productResponses,HttpStatus.OK);
    }

    @PostMapping("/admin/Add")
    public ResponseEntity<ProductResponse> addProduct(@RequestBody CreateProductRequest createProductRequest) {
        // Fetch the Category using the categoryId from the DTO
        Category category = categoryRepository.findById(createProductRequest.getCategoryId())
                .orElseThrow(() -> new ProductNotFoundException("Category not found with id: " + createProductRequest.getCategoryId()));

        // Create a new Product entity from the DTO and the fetched Category
        Product product = new Product();
        product.setName(createProductRequest.getName());
        product.setDescription(createProductRequest.getDescription());
        product.setPrice(createProductRequest.getPrice());
        product.setStock(createProductRequest.getStock());
        product.setCategory(category);

        Product createdProduct = productService.createProduct(product);
        ProductResponse productResponse = productService.convertToProductResponse(createdProduct);
        return new ResponseEntity<>(productResponse, HttpStatus.CREATED);
    }

    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody EditProductRequest request) {
        try {
            ProductResponse updatedProductDto = productService.updateProduct(id, request);
            return ResponseEntity.ok(updatedProductDto);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to update product."));
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully."));
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to delete product."));
        }
    }


    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> categoryResponses = categoryService.getCategories();
        return new ResponseEntity<>(categoryResponses,HttpStatus.OK);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(String keyword) {
        return productService.searchProducts(keyword);
    }


}
