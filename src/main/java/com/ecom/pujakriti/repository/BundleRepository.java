package com.ecom.pujakriti.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.Guide;
import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.entity.Puja;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BundleRepository extends JpaRepository<Bundle, Integer> {


    Page<Bundle> findAll(Specification<Bundle> spec, Pageable pageable);

    Specification<Bundle> findByNameContainingIgnoreCase(String name);

    Specification<Bundle> findByPuja(Puja puja);

    Specification<Bundle> findByGuide(Guide guideId);


}
