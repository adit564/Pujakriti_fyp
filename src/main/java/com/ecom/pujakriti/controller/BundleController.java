package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.*;
import com.ecom.pujakriti.service.BundleCasteService;
import com.ecom.pujakriti.service.BundleService;
import com.ecom.pujakriti.service.GuideService;
import com.ecom.pujakriti.service.PujaService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/bundles")
@Log4j2
public class BundleController {


    @Autowired
    private BundleService bundleService;

    @Autowired
    private PujaService pujaService;

    @Autowired
    private GuideService guideService;

    @Autowired
    private BundleCasteService bundleCasteService;


    @GetMapping("/{id}")
    public ResponseEntity<BundleResponse> getBundleById(@PathVariable Integer id) {
        try {
            BundleResponse bundleResponse = bundleService.getBundleById(id);
            return new ResponseEntity<>(bundleResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<Page<BundleResponse>> getBundles(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "puja", required = false) Integer PujaID,
            @RequestParam(name = "guide", required = false) Integer GuideID,
            @RequestParam(name = "sort", defaultValue = "bundleId") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortOrder = Sort.by(direction,sort);
        Pageable pageable = PageRequest.of(page,size,sortOrder);

        Page<BundleResponse> bundleResponses = bundleService.getBundles(pageable, PujaID, GuideID, keyword);

        return new ResponseEntity<>(bundleResponses, HttpStatus.OK);
    }


    @GetMapping("/pujas")
    public ResponseEntity<List<PujaResponse>> getPujas(){
        List<PujaResponse> pujaResponses = pujaService.getPujas();

        return new ResponseEntity<>(pujaResponses,HttpStatus.OK);
    }


    @GetMapping("/guides")
    public ResponseEntity<List<GuideResponse>> getGuides(){
        List<GuideResponse> guideResponses = guideService.getGuides();

        return new ResponseEntity<>(guideResponses,HttpStatus.OK);
    }


    @GetMapping("/search")
    public List<Bundle> searchBundles(String keyword) {
        return bundleService.searchBundles(keyword);
    }


    @GetMapping("/bundleCastes")
    public ResponseEntity<List<BundleCasteResponse>> getBundleCastes(){
        List<BundleCasteResponse> bundleCasteResponses = bundleCasteService.getBundleCastes();

        return new ResponseEntity<>(bundleCasteResponses,HttpStatus.OK);
    }

    @GetMapping("/castes")
    public ResponseEntity<List<CasteResponse>> getCastes(){
        List<CasteResponse> casteResponses = bundleCasteService.getCastes();

        return new ResponseEntity<>(casteResponses,HttpStatus.OK);
    }


    @PostMapping("/admin/Add") // New endpoint for adding bundles
    public ResponseEntity<BundleResponse> addBundle(@RequestBody AddBundleRequest addBundleRequest) {
        try {
            BundleResponse savedBundle = bundleService.addBundle(addBundleRequest);
            return new ResponseEntity<>(savedBundle, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error adding bundle:", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/admin/update/{bundleId}")
    public ResponseEntity<?> updateBundle(@PathVariable Integer bundleId, @RequestBody EditBundleRequest request) {
        try {
            BundleResponse updatedBundle = bundleService.updateBundle(bundleId, request);
            return ResponseEntity.ok(updatedBundle);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to update bundle."));
        }
    }


    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteBundle(@PathVariable Integer id) {
        try {
            bundleService.deleteBundle(id);
            return ResponseEntity.ok(Map.of("message", "Bundle deleted successfully."));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to delete bundle."));
        }
    }


}
