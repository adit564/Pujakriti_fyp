package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getCategories();

    CategoryResponse getCategoryById(Integer categoryId);

    CategoryResponse saveCategory(CategoryResponse newCategory);

    CategoryResponse updateCategory(Integer categoryId, CategoryResponse updatedCategory);

    void deleteCategory(Integer categoryId);
}
