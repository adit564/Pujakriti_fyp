package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ImageService {

ProductImageResponse getProductImageByProductId(Integer id);

BundleImageResponse getBundleImageByBundleId(Integer id);

Page<ProductImageResponse> getProductImages(Pageable pageable, String keyword);

Page<BundleImageResponse> getBundleImages(Pageable pageable, String keyword);


}

