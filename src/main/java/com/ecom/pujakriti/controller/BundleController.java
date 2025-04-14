package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.entity.Puja;
import com.ecom.pujakriti.model.BundleResponse;
import com.ecom.pujakriti.model.PujaResponse;
import com.ecom.pujakriti.service.BundleService;
import com.ecom.pujakriti.service.PujaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bundles")
public class BundleController {

    private final BundleService bundleService;
    private final PujaService pujaService;

    public BundleController(BundleService bundleService, PujaService pujaService) {
        this.bundleService = bundleService;
        this.pujaService = pujaService;
    }


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

    @GetMapping("/search")
    public List<Bundle> searchBundles(String keyword) {
        return bundleService.searchBundles(keyword);
    }

}
