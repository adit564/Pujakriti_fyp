package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Caste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasteRepository extends JpaRepository<Caste, Long> {
}
