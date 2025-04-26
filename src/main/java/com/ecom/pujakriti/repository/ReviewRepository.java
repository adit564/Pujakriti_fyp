package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.Review;
import com.ecom.pujakriti.model.ReviewResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByUser_UserId(Integer userUserId);
}
