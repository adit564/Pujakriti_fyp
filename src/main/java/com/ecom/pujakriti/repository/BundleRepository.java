package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Bundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BundleRepository extends JpaRepository<Bundle, Integer> {
}
