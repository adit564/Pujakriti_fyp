package com.ecom.pujakriti.service;


import com.ecom.pujakriti.entity.*;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.AddBundleRequest;
import com.ecom.pujakriti.model.BundleResponse;
import com.ecom.pujakriti.model.EditBundleRequest;
import com.ecom.pujakriti.repository.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Log4j2
public class BundleServiceImpl implements BundleService {

    @Autowired
    private BundleRepository bundleRepository;

    @Autowired
    private PujaRepository pujaRepository;

    @Autowired
    private GuideRepository guideRepository;

    @Autowired
    private BundleImageRepository bundleImageRepository;

    @Override
    public BundleResponse getBundleById(Integer id) {
        log.info("Fetching bundle by id: " + id);
        Bundle bundle = bundleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bundle not found"));
        log.info("Bundle: " + bundle);
        return convertToBundleResponse(bundle);
    }

    private final Path imageStorageLocationBundle = Paths.get("D:/ICP/FYP/Development/pujakriti/client/public/images/bundle_img");

    @Override
    public Page<BundleResponse> getBundles(Pageable pageable, Integer pujaId, Integer guideId, String keyword){
        log.info("Fetching bundles");
        Specification<Bundle> spec = Specification.where(null);


        if(pujaId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("puja").get("pujaId"), pujaId));
        }

        if(guideId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("guide").get("guideId"), guideId));
        }

        if(keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + keyword + "%"));
        }

        return bundleRepository.findAll(spec,pageable).map(this::convertToBundleResponse);

    }

    @Override
    public List<Bundle> searchBundles(String keyword) {
        log.info("Fetching bundles");

        return bundleRepository.findByNameContainingIgnoreCase(keyword);
    }

    private BundleResponse convertToBundleResponse(Bundle bundle) {
        return BundleResponse.builder()
                .bundleId(bundle.getBundleId())
                .name(bundle.getName())
                .description(bundle.getDescription())
                .price(bundle.getPrice())
                .stock(bundle.getStock())
                .guide(bundle.getGuide().getName())
                .puja(bundle.getPuja().getName())
                .build();
    }

    @Override
    @Transactional // Ensure all operations happen in a single transaction
    public BundleResponse addBundle(AddBundleRequest addBundleRequest) {
        log.info("Adding new bundle: {}", addBundleRequest);

        // Create and save Puja
        Puja puja = Puja.builder()
                .name(addBundleRequest.getPuja().getName())
                .description(addBundleRequest.getPuja().getDescription())
                .build();
        Puja savedPuja = pujaRepository.save(puja);
        log.info("Saved Puja: {}", savedPuja);

        // Create and save Guide
        Guide guide = Guide.builder()
                .name(addBundleRequest.getGuide().getName())
                .description(addBundleRequest.getGuide().getDescription())
                .content(addBundleRequest.getGuide().getContent())
                .build();
        Guide savedGuide = guideRepository.save(guide);
        log.info("Saved Guide: {}", savedGuide);

        // Create and save Bundle
        Bundle bundle = Bundle.builder()
                .name(addBundleRequest.getName())
                .description(addBundleRequest.getDescription())
                .price(addBundleRequest.getPrice())
                .stock(addBundleRequest.getStock())
                .puja(savedPuja)
                .guide(savedGuide)
                .build();
        Bundle savedBundle = bundleRepository.save(bundle);
        log.info("Saved Bundle: {}", savedBundle);

        return convertToBundleResponse(savedBundle);
    }


    @Override
    public BundleResponse updateBundle(Integer bundleId, EditBundleRequest request) {
        Optional<Bundle> existingBundleOptional = bundleRepository.findById(bundleId);
        if (existingBundleOptional.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + bundleId);
        }
        Bundle existingBundle = existingBundleOptional.get();

        existingBundle.setName(request.getName());
        existingBundle.setDescription(request.getDescription());
        existingBundle.setPrice(request.getPrice());
        existingBundle.setStock(request.getStock());

        if (request.getPujaId() != null) {
            Optional<Puja> existingPujaOptional = pujaRepository.findById(request.getPujaId());
            existingPujaOptional.ifPresent(existingBundle::setPuja);
        }

        if (request.getGuideId() != null) {
            Optional<Guide> existingGuideOptional = guideRepository.findById(request.getGuideId());
            existingGuideOptional.ifPresent(existingBundle::setGuide);
        }
        Bundle updatedBundle = bundleRepository.save(existingBundle);

        return convertToBundleResponse(updatedBundle);
    }



    @Transactional // Ensure all deletions happen in a single transaction
    public void deleteBundle(Integer id) throws ProductNotFoundException {
        Optional<Bundle> bundleOptional = bundleRepository.findById(id);
        if (bundleOptional.isEmpty()) {
            throw new ProductNotFoundException("Bundle not found with id: " + id);
        }
        Bundle bundle = bundleOptional.get();

        // Delete associated BundleImage(s) and their files
        List<BundleImage> bundleImages = bundleImageRepository.findByBundle(bundle);
        for (BundleImage bundleImage : bundleImages) {
            Path imagePathToDelete = imageStorageLocationBundle.resolve(bundleImage.getImageUrl());
            try {
                if (Files.exists(imagePathToDelete)) {
                    log.info("Deleting bundle image file: {}", imagePathToDelete);
                    Files.delete(imagePathToDelete);
                } else {
                    log.warn("Bundle image file not found: {}", imagePathToDelete);
                }
                bundleImageRepository.delete(bundleImage); // Delete the database record
            } catch (IOException e) {
                log.error("Error deleting bundle image file {}: {}", imagePathToDelete, e.getMessage(), e);
                // Consider whether to re-throw the exception or continue deleting other parts
            }
        }

        // Delete associated Puja
        if (bundle.getPuja() != null) {
            pujaRepository.delete(bundle.getPuja());
        }

        // Delete associated Guide
        if (bundle.getGuide() != null) {
            guideRepository.delete(bundle.getGuide());
        }

        // Now delete the Bundle
        bundleRepository.delete(bundle);
    }

}
