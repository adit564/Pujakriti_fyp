package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

ProductImageResponse getProductImageByProductId(Integer id);

BundleImageResponse getBundleImageByBundleId(Integer id);

Page<ProductImageResponse> getProductImages(Pageable pageable, Integer productId, String keyword);

Page<BundleImageResponse> getBundleImages(Pageable pageable, Integer bundleId, String keyword);

void uploadBundleImage(Integer bundleId, MultipartFile imageFile);

}

