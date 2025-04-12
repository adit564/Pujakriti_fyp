package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.model.BundleImageResponse;
import com.ecom.pujakriti.model.ProductImageResponse;
import com.ecom.pujakriti.service.ImageService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/images")
public class ImageController {


    private final ImageService imageService;


    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }


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


}
