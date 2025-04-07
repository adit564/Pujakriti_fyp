package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Category;
import com.ecom.pujakriti.model.CategoryResponse;
import com.ecom.pujakriti.repository.CategoryRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@Log4j2
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
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


    public CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

}
