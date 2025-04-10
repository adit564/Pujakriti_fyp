package com.ecom.pujakriti.service;


import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.model.BundleResponse;
import com.ecom.pujakriti.repository.BundleRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class BundleServiceImpl implements BundleService {

    private final BundleRepository bundleRepository;

    public BundleServiceImpl(BundleRepository bundleRepository) {
        this.bundleRepository = bundleRepository;
    }

    @Override
    public BundleResponse getBundleById(Integer id) {
        log.info("Fetching bundle by id: " + id);
        Bundle bundle = bundleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bundle not found"));
        log.info("Bundle: " + bundle);
        return convertToBundleResponse(bundle);
    }

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

    private BundleResponse convertToBundleResponse(Bundle bundle) {
        return BundleResponse.builder()
                .bundleId(bundle.getBundleId())
                .name(bundle.getName())
                .description(bundle.getDescription())
                .price(bundle.getPrice())
                .guide(bundle.getGuide().getName())
                .puja(bundle.getPuja().getName())
                .build();
    }


}
