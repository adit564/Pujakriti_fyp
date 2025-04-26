package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Category;
import com.ecom.pujakriti.model.CategoryResponse;
import com.ecom.pujakriti.repository.CategoryRepository;
import com.ecom.pujakriti.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
    this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<CategoryResponse> getCategories() {

        log.info("Fetching categories");

        List<Category> categories = categoryRepository.findAll();

        List<CategoryResponse> categoryResponses = categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        log.info("Categories fetched successfully");

        return categoryResponses;
    }

    @Override
    public CategoryResponse getCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return convertToResponse(category);
    }

    @Override
    public CategoryResponse saveCategory(CategoryResponse newCategory) {
        Category category = new Category();
        category.setName(newCategory.getName());
        category.setDescription(newCategory.getDescription());
        category.setCategoryId(newCategory.getCategoryId());
        categoryRepository.save(category);
        return convertToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Integer categoryId, CategoryResponse updatedCategory) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        category.setName(updatedCategory.getName());
        category.setDescription(updatedCategory.getDescription());
        categoryRepository.save(category);
        return convertToResponse(category);
    }

    @Override
    public void deleteCategory(Integer categoryId) {
            if (!categoryRepository.existsById(categoryId)){
              throw new IllegalArgumentException("Category not found");
            }
            categoryRepository.deleteById(categoryId);
    }


    public CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

}
