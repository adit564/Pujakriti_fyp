package com.ecom.pujakriti.service;


import com.ecom.pujakriti.entity.Review;
import com.ecom.pujakriti.model.ReviewResponse;
import com.ecom.pujakriti.repository.ReviewRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ReviewServiceImpl implements ReviewService{

    @Autowired
    private ReviewRepository reviewRepository;

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public List<ReviewResponse> getReviewsByUserId(Integer userId) {
        List<Review> reviews = reviewRepository.findByUser_UserId(userId);

        return reviews.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private ReviewResponse convertToResponse(Review review) {
        Integer productId = null;
        Integer bundleId = null;

        if(review.getProduct() != null) {
            productId = review.getProduct().getProductId();
        }else if(review.getBundle() != null) {
            bundleId = review.getBundle().getBundleId();
        }

        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUser().getUserId())
                .productId(productId)
                .bundleId(bundleId)
                .rating(review.getRating())
                .reviewDate(review.getReviewDate())
                .build();
    }


}
