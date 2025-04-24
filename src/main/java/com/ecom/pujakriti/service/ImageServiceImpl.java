package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.BundleImage;
import com.ecom.pujakriti.entity.ProductImage;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import com.ecom.pujakriti.repository.BundleImageRepository;
import com.ecom.pujakriti.repository.BundleRepository;
import com.ecom.pujakriti.repository.ProductImageRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Log4j2
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private BundleImageRepository bundleImageRepository;

    @Autowired
    private BundleRepository bundleRepository;

    private final Path bundleStorageLocation = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/bundle_img");


    @Override
    public ProductImageResponse getProductImageByProductId(Integer id) {
        log.info("Fetching product image by id: {}", id);
        ProductImage productImage = productImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product image not found"));
        return convertToProductImageResponse(productImage);
    }

    @Override
    public BundleImageResponse getBundleImageByBundleId(Integer id) {
        log.info("Fetching bundle image by id: {}", id);
        BundleImage bundleImage = bundleImageRepository.findByBundle_BundleId(id)
                .orElseThrow(() -> new RuntimeException("Bundle image not found"));
        return convertToBundleImageResponse(bundleImage);
    }

    @Override
    public Page<ProductImageResponse> getProductImages(Pageable pageable, Integer productId, String keyword) {
        log.info("Fetching product images");
        Specification<ProductImage> spec = Specification.where(null);

        if (productId != null) {
            spec = spec.and((root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("product").get("productId"), productId));
        }

        return productImageRepository.findAll(spec,pageable).map(this::convertToProductImageResponse);
    }

    @Override
    public Page<BundleImageResponse> getBundleImages(Pageable pageable, Integer bundleId, String keyword) {
        log.info("Fetching bundle images");
        Specification<BundleImage> spec = Specification.where(null);

        if (bundleId != null) {
            spec = spec.and((root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("bundle").get("bundleId"), bundleId));
        }
        return bundleImageRepository.findAll(spec,pageable).map(this::convertToBundleImageResponse);
    }


    @Override
    public void uploadBundleImage(Integer bundleId, MultipartFile imageFile) {
        Bundle bundle = bundleRepository.findById(bundleId)
                .orElseThrow(() -> new ProductNotFoundException("Bundle not found with id: " + bundleId));

        if (imageFile.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file.");
        }

        try {
            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String generatedFileName = bundle.getName().toLowerCase().replaceAll("\\s+", "") + "_" + bundleId + fileExtension;
            Path destinationPath = bundleStorageLocation.resolve(generatedFileName);
            Files.copy(imageFile.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

            BundleImage bundleImage = BundleImage.builder()
                    .bundle(bundle)
                    .imageUrl(generatedFileName)
                    .name(bundle.getName())
                    .build();
            bundleImageRepository.save(bundleImage);
            log.info("Bundle image uploaded successfully for bundle ID: {}", bundleId);

        } catch (IOException e) {
            log.error("Failed to upload bundle image for bundle ID: {}", bundleId, e);
            throw new RuntimeException("Failed to upload bundle image.", e);
        }
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
