package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.BundleImage;
import com.ecom.pujakriti.entity.ProductImage;
import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import com.ecom.pujakriti.repository.BundleImageRepository;
import com.ecom.pujakriti.repository.ProductImageRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class ImageServiceImpl implements ImageService {

    private final ProductImageRepository productImageRepository;
    private final BundleImageRepository bundleImageRepository;

    public ImageServiceImpl(ProductImageRepository productImageRepository, BundleImageRepository bundleImageRepository) {
        this.productImageRepository = productImageRepository;
        this.bundleImageRepository = bundleImageRepository;
    }


    @Override
    public ProductImageResponse getProductImageByProductId(Integer id) {
        log.info("Fetching product image by id: " + id);
        ProductImage productImage = productImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Image not found"));
        return convertToProductImageResponse(productImage);
    }

    @Override
    public BundleImageResponse getBundleImageByBundleId(Integer id) {
        log.info("Fetching bundle image by id: " + id);
        BundleImage bundleImage = bundleImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Image not found"));
        return convertToBundleImageResponse(bundleImage);
    }

    @Override
    public Page<ProductImageResponse> getProductImages(Pageable pageable, String keyword) {
        log.info("Fetching product images");
        Specification<ProductImage> spec = Specification.where(null);
        return productImageRepository.findAll(spec,pageable).map(this::convertToProductImageResponse);
    }



    @Override
    public Page<BundleImageResponse> getBundleImages(Pageable pageable, String keyword) {
        log.info("Fetching bundle images");
        Specification<BundleImage> spec = Specification.where(null);
        return bundleImageRepository.findAll(spec,pageable).map(this::convertToBundleImageResponse);
    }



    private ProductImageResponse convertToProductImageResponse(ProductImage productImage) {
        return ProductImageResponse.builder()
                .imageId(productImage.getImageId())
                .name(productImage.getName())
                .imageUrl(productImage.getImageUrl())
                .productId(productImage.getProduct().getProductId())
                .build();
    }

    private BundleImageResponse convertToBundleImageResponse(BundleImage bundleImage) {
        return BundleImageResponse.builder()
                .imageId(bundleImage.getImageId())
                .name(bundleImage.getName())
                .imageUrl(bundleImage.getImageUrl())
                .bundleId(bundleImage.getBundle().getBundleId())
                .build();
    }
}
