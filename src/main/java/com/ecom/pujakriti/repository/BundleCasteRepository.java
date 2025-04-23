package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.BundleCaste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BundleCasteRepository extends JpaRepository<BundleCaste, Integer> {
}
