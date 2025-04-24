package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.BundleImage;
import com.ecom.pujakriti.entity.Product;
import com.ecom.pujakriti.entity.ProductImage;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import com.ecom.pujakriti.repository.BundleImageRepository;
import com.ecom.pujakriti.repository.BundleRepository;
import com.ecom.pujakriti.repository.ProductImageRepository;
import com.ecom.pujakriti.repository.ProductRepository;
import com.ecom.pujakriti.service.ImageService;

import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/images")
@Log4j2
public class ImageController {


    @Autowired
    private ImageService imageService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BundleRepository bundleRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    private final Path imageStorageLocation = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/product_img");

    private final Path imageStorageLocationBundle = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/bundle_img");


    @Autowired
    private BundleImageRepository bundleImageRepository;

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductImageResponse> getProductImageById(@PathVariable Integer id) {
        try {
            ProductImageResponse response = imageService.getProductImageByProductId(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/bundle/{id}")
    public ResponseEntity<BundleImageResponse> getBundleImageById(@PathVariable Integer id) {
        try {
            BundleImageResponse response = imageService.getBundleImageByBundleId(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/productImages")
    public ResponseEntity<Page<ProductImageResponse>> getProductImages(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "product", required = false) Integer productId,
            @RequestParam(name = "sort", defaultValue = "imageId") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortOrder = Sort.by(direction,sort);
        Pageable pageable = PageRequest.of(page,size,sortOrder);
        Page<ProductImageResponse> productImages = imageService.getProductImages(pageable,productId, keyword);
        return new ResponseEntity<>(productImages, HttpStatus.OK);
    }

    @GetMapping("/bundlesImages")
    public ResponseEntity<Page<BundleImageResponse>> getBundleImages(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "bundle", required = false) Integer bundleId,
            @RequestParam(name = "sort", defaultValue = "imageId") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortOrder = Sort.by(direction,sort);
        Pageable pageable = PageRequest.of(page,size,sortOrder);

        Page<BundleImageResponse> bundleImages = imageService.getBundleImages(pageable,bundleId, keyword);
        return new ResponseEntity<>(bundleImages, HttpStatus.OK);
    }


    @PostMapping("/product/upload/{productId}")
    public ResponseEntity<?> uploadProductImage(@PathVariable Integer productId, @RequestParam("image") MultipartFile imageFile) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

            if (imageFile.isEmpty()) {
                return new ResponseEntity<>("Please select an image file.", HttpStatus.BAD_REQUEST);
            }

            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String generatedFileName = product.getName().toLowerCase().replaceAll("\\s+", "") + "_" + productId + fileExtension;

            // Temporary location to save the image (still in client's public - NOT PRODUCTION BEST PRACTICE)
            Path destinationPath = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/product_img", generatedFileName);

            Files.copy(imageFile.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

            ProductImage productImage = ProductImage.builder()
                    .product(product)
                    .imageUrl(generatedFileName)
                    .name(product.getName())
                    .build();

            productImageRepository.save(productImage);
            // Return a JSON response for success
            return new ResponseEntity<>(Map.of("message", "Image uploaded successfully."), HttpStatus.OK);


        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload image.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/bundle/upload/{bundleId}")
    public ResponseEntity<?> uploadBundleImage(@PathVariable Integer bundleId, @RequestParam("image") MultipartFile imageFile) {
        try {
            Bundle bundle = bundleRepository.findById(bundleId)
                    .orElseThrow(() -> new ProductNotFoundException("Bundle not found with id: " + bundleId));

            if (imageFile.isEmpty()) {
                return new ResponseEntity<>(Map.of("message", "Please select an image file."), HttpStatus.BAD_REQUEST);
            }

            imageService.uploadBundleImage(bundleId, imageFile);
            return new ResponseEntity<>(Map.of("message", "Bundle image uploaded successfully."), HttpStatus.OK);

        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Failed to upload bundle image."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/product/update/{productId}")
    public ResponseEntity<?> updateProductImage(@PathVariable Integer productId, @RequestParam("image") MultipartFile newImageFile) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

            if (newImageFile.isEmpty()) {
                return new ResponseEntity<>(Map.of("message", "Please select a new image file."), HttpStatus.BAD_REQUEST);
            }

            List<ProductImage> existingProductImages = productImageRepository.findByProduct(product);

            if (!existingProductImages.isEmpty()) {
                // Assuming there's only one main image per product for now
                ProductImage existingProductImage = existingProductImages.get(0);

                // Delete the old image file (if it exists)
                Path oldImagePath = imageStorageLocation.resolve(existingProductImage.getImageUrl());
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }

                // Generate new filename
                String originalFilename = newImageFile.getOriginalFilename();
                String fileExtension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                    fileExtension = originalFilename.substring(dotIndex);
                }
                String generatedFileName = product.getName().toLowerCase().replaceAll("\\s+", "") + "_" + productId + fileExtension;

                // Save the new image
                Path newImagePath = imageStorageLocation.resolve(generatedFileName);
                Files.copy(newImageFile.getInputStream(), newImagePath, StandardCopyOption.REPLACE_EXISTING);

                // Update the ProductImage record in the database
                existingProductImage.setImageUrl(generatedFileName);
                productImageRepository.save(existingProductImage);

                return new ResponseEntity<>(Map.of("message", "Product image updated successfully."), HttpStatus.OK);

            } else {
                // If no existing image, upload as a new one
                String originalFilename = newImageFile.getOriginalFilename();
                String fileExtension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                    fileExtension = originalFilename.substring(dotIndex);
                }
                String generatedFileName = product.getName().toLowerCase().replaceAll("\\s+", "") + "_" + productId + fileExtension;

                Path destinationPath = imageStorageLocation.resolve(generatedFileName);
                Files.copy(newImageFile.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

                ProductImage productImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(generatedFileName)
                        .name(product.getName())
                        .build();

                productImageRepository.save(productImage);
                return new ResponseEntity<>(Map.of("message", "Product image uploaded successfully."), HttpStatus.OK);
            }

        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Failed to update product image."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/bundle/update/{bundleId}")
    public ResponseEntity<?> updateBundleImage(@PathVariable Integer bundleId, @RequestParam("image") MultipartFile newImageFile) {
        try {
            Bundle bundle = bundleRepository.findById(bundleId)
                    .orElseThrow(() -> new ProductNotFoundException("Bundle not found with id: " + bundleId));

            if (newImageFile.isEmpty()) {
                return new ResponseEntity<>(Map.of("message", "Please select a new image file."), HttpStatus.BAD_REQUEST);
            }

            List<BundleImage> existingBundleImages = bundleImageRepository.findByBundle(bundle);

            if (!existingBundleImages.isEmpty()) {
                BundleImage existingBundleImage = existingBundleImages.get(0);

                // Delete the old image file (if it exists)
                Path oldImagePath = imageStorageLocationBundle.resolve(existingBundleImage.getImageUrl());
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }


                // Generate new filename
                String originalFilename = newImageFile.getOriginalFilename();
                String fileExtension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                    fileExtension = originalFilename.substring(dotIndex);
                }
                String generatedFileName = bundle.getName().toLowerCase().replaceAll("\\s+", "") + "_" + bundleId + fileExtension;

                // Save the new image
                Path newImagePath = imageStorageLocationBundle.resolve(generatedFileName);
                Files.copy(newImageFile.getInputStream(), newImagePath, StandardCopyOption.REPLACE_EXISTING);

                // Update the ProductImage record in the database
                existingBundleImage.setImageUrl(generatedFileName);
                bundleImageRepository.save(existingBundleImage);

                return new ResponseEntity<>(Map.of("message", "Bundle image updated successfully."), HttpStatus.OK);

            } else {
                // If no existing image, upload as a new one
                String originalFilename = newImageFile.getOriginalFilename();
                String fileExtension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                    fileExtension = originalFilename.substring(dotIndex);
                }
                String generatedFileName = bundle.getName().toLowerCase().replaceAll("\\s+", "") + "_" + bundleId + fileExtension;

                Path destinationPath = imageStorageLocationBundle.resolve(generatedFileName);
                Files.copy(newImageFile.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

                BundleImage bundleImage = BundleImage.builder()
                        .bundle(bundle)
                        .imageUrl(generatedFileName)
                        .name(bundle.getName())
                        .build();

                bundleImageRepository.save(bundleImage);
                return new ResponseEntity<>(Map.of("message", "Bundle image uploaded successfully."), HttpStatus.OK);
            }

        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Failed to update Bundle image."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
