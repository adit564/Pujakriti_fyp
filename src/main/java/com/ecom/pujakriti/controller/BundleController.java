package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.Puja;
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


    @GetMapping("/pujas/{pujaId}")
    public ResponseEntity<PujaResponse> getPujaById(@PathVariable Integer pujaId) {
        try {
            PujaResponse puja = pujaService.findPujaById(pujaId);
            return ResponseEntity.ok(puja);
        } catch (ProductNotFoundException e) {
          return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/pujas/{pujaId}")
    public ResponseEntity<?> updatePuja(@PathVariable Integer pujaId, @RequestBody PujaResponse updatedPuja) {
        try {
            PujaResponse puja = pujaService.updatePuja(pujaId, updatedPuja);
            return ResponseEntity.ok(puja);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }


    @GetMapping("/guides")
    public ResponseEntity<List<GuideResponse>> getGuides(){
        List<GuideResponse> guideResponses = guideService.getGuides();

        return new ResponseEntity<>(guideResponses,HttpStatus.OK);
    }

    @GetMapping("/guides/{guideId}")
    public ResponseEntity<GuideResponse> getGuideById(@PathVariable Integer guideId) {
       try {
           GuideResponse guideResponse = guideService.getGuideById(guideId);
           return ResponseEntity.ok(guideResponse);
       }catch (ProductNotFoundException e){
           return new ResponseEntity<>(HttpStatus.NOT_FOUND);
       }
    }

    @PutMapping("/guides/{guideId}")
    public ResponseEntity<?> updateGuide(@PathVariable Integer guideId, @RequestBody GuideResponse updatedGuide) {
        try {
            GuideResponse guideResponse = guideService.updateGuide(guideId, updatedGuide);
            return ResponseEntity.ok(guideResponse);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
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

    @PostMapping("/bundlecastes")
    public ResponseEntity<BundleCasteResponse> addBundleCaste(@RequestBody BundleCasteRequest bundleCasteRequest) {
        log.info("Adding bundle caste: {}", bundleCasteRequest);
        BundleCasteResponse addedBundleCaste = bundleCasteService.addBundleCaste(bundleCasteRequest);
        return new ResponseEntity<>(addedBundleCaste, HttpStatus.CREATED);
    }

    @PutMapping("/bundlecastes/{id}")
    public ResponseEntity<BundleCasteResponse> updateBundleCaste(@PathVariable Integer id, @RequestBody BundleCasteRequest bundleCasteRequest) {
        log.info("Updating bundle caste with ID {} to: {}", id, bundleCasteRequest);
        try {
            BundleCasteResponse updatedBundleCaste = bundleCasteService.updateBundleCaste(id, bundleCasteRequest);
            return new ResponseEntity<>(updatedBundleCaste, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/bundlecastes/{id}")
    public ResponseEntity<Void> deleteBundleCaste(@PathVariable Integer id) {
        log.info("Deleting bundle caste with ID: {}", id);
        bundleCasteService.deleteBundleCaste(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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


    @GetMapping("/castes")
    public ResponseEntity<List<CasteResponse>> getCastes(){
        List<CasteResponse> casteResponses = bundleCasteService.getCastes();

        return new ResponseEntity<>(casteResponses,HttpStatus.OK);
    }


    @GetMapping("/caste/{casteId}")
    public ResponseEntity<CasteResponse> getCasteById(@PathVariable Integer casteId) {
        CasteResponse casteResponse = bundleCasteService.getCasteById(casteId);
        return new ResponseEntity<>(casteResponse,HttpStatus.OK);
    }

    @PostMapping("/castes")
    public ResponseEntity<?> addCaste(@RequestBody CasteResponse casteResponse) {
        CasteResponse savedCaste = bundleCasteService.addCaste(casteResponse);
        return new ResponseEntity<>(savedCaste, HttpStatus.CREATED);
    }

    @PutMapping("/castes/{casteId}")
    public ResponseEntity<?> updateCaste(@PathVariable Integer casteId, @RequestBody CasteResponse updatedCasteResponse) {
        try {
            CasteResponse savedCaste = bundleCasteService.updateCaste(casteId, updatedCasteResponse);
            return new ResponseEntity<>(savedCaste, HttpStatus.OK);
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/castes/{casteId}")
    public ResponseEntity<?> deleteCaste(@PathVariable Integer casteId) {
        try {
            bundleCasteService.deleteCaste(casteId);
            return ResponseEntity.ok(Map.of("message", "Caste deleted successfully."));
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

}
