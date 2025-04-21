package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Category;
import com.ecom.pujakriti.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {


    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    List<Product> findByNameContainingIgnoreCase(String name);

    Specification<Product> findByCategory(Category category);

}
