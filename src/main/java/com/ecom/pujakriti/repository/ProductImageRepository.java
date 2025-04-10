package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.entity.ProductImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {


    Page<ProductImage> findAll(Specification<ProductImage> spec, Pageable pageable);

    Specification<ProductImage> findByProduct(Product product);
}
