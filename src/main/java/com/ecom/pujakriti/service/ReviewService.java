package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.ReviewResponse;

import java.util.List;

public interface ReviewService {

    List<ReviewResponse> getAllReviews();
    void deleteReview(Integer reviewId);
    List<ReviewResponse> getReviewsByUserId(Integer userId);

}
