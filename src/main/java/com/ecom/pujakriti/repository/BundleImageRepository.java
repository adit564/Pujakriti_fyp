package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.BundleImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BundleImageRepository extends JpaRepository<BundleImage, Integer> {

    Page<BundleImage> findAll(Specification<BundleImage> spec, Pageable pageable);

    Specification<BundleImage> findByBundle(Bundle bundle);

}
