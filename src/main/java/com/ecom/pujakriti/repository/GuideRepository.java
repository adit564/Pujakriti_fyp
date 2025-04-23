package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Guide;
import com.ecom.pujakriti.entity.Puja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Integer> {
    List<Guide> findByPuja(Puja puja);
}
