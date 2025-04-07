package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Puja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PujaRepository extends JpaRepository<Puja, Integer> {
}
