package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.BundleCaste;
import com.ecom.pujakriti.entity.Caste;
import com.ecom.pujakriti.model.BundleCasteRequest;
import com.ecom.pujakriti.model.BundleCasteResponse;
import com.ecom.pujakriti.model.CasteResponse;
import com.ecom.pujakriti.repository.BundleCasteRepository;
import com.ecom.pujakriti.repository.BundleRepository;
import com.ecom.pujakriti.repository.CasteRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BundleCastesServiceImpl implements BundleCasteService {

    @Autowired
    private BundleCasteRepository bundleCasteRepository;

    @Autowired
    private BundleRepository bundleRepository;

    @Autowired
    private CasteRepository casteRepository;

    @Override
    public List<BundleCasteResponse> getBundleCastes() {

        log.info("Fetching bundle castes...");

        List<BundleCaste>  bundleCastes = bundleCasteRepository.findAll();

        return bundleCastes.stream()
                .map(this::mapToBundleCasteResponse)
                .toList();
    }


    private BundleCasteResponse mapToBundleCasteResponse(BundleCaste bundleCaste) {
        return BundleCasteResponse.builder()
                .id(bundleCaste.getBundleCasteId())
                .bundleId(bundleCaste.getBundle().getBundleId())
                .casteId(bundleCaste.getCaste().getCasteId())
                .build();
    }

    @Override
    public BundleCasteResponse addBundleCaste(BundleCasteRequest bundleCasteRequest) {
        BundleCaste bundleCaste = convertToEntity(bundleCasteRequest);
        BundleCaste savedBundleCaste = bundleCasteRepository.save(bundleCaste);
        return convertToResponse(savedBundleCaste);
    }

    @Override
    public BundleCasteResponse updateBundleCaste(Integer id, BundleCasteRequest bundleCasteRequest) {
        Optional<BundleCaste> existingBundleCasteOptional = bundleCasteRepository.findById(id);
        if (existingBundleCasteOptional.isEmpty()) {
            throw new IllegalArgumentException("BundleCaste not found with ID: " + id);
        }
        BundleCaste existingBundleCaste = existingBundleCasteOptional.get();
        existingBundleCaste.setBundle(bundleRepository.findById(bundleCasteRequest.getBundleId()).get());
        existingBundleCaste.setCaste(casteRepository.findById(bundleCasteRequest.getCasteId()).get());
        BundleCaste updatedBundleCaste = bundleCasteRepository.save(existingBundleCaste);
        return convertToResponse(updatedBundleCaste);
    }

    @Override
    public void deleteBundleCaste(Integer id) {
        bundleCasteRepository.deleteById(id);
    }

    private BundleCasteResponse convertToResponse(BundleCaste bundleCaste) {
        return BundleCasteResponse.builder()
                .id(bundleCaste.getBundleCasteId())
                .bundleId(bundleCaste.getBundle().getBundleId())
                .casteId(bundleCaste.getCaste().getCasteId())
                .build();
    }

    private BundleCaste convertToEntity(BundleCasteRequest request) {
        return BundleCaste.builder()
                .bundle(bundleRepository.findById(request.getBundleId()).get())
                .caste(casteRepository.findById(request.getCasteId()).get())
                .build();
    }

    @Override
    public List<CasteResponse> getCastes() {
        log.info("Fetching castes...");

        List<Caste> castes = casteRepository.findAll();

        return castes.stream()
                .map(this::mapToCasteResponse)
                .toList();
    }

    @Override
    public CasteResponse getCasteById(Integer id){
        Caste caste = casteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caste not found with ID: " + id));
        return mapToCasteResponse(caste);
    }

    @Override
    public CasteResponse addCaste(CasteResponse casteResponse){
        Caste caste = new Caste();
        caste.setCasteId(casteResponse.getCasteId());
        caste.setName(casteResponse.getName());
        casteRepository.save(caste);
        return mapToCasteResponse(caste);
    }

    @Override
    public CasteResponse updateCaste(Integer id, CasteResponse updateCaste){
        Caste caste = casteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caste not found with ID: " + id));
        caste.setName(updateCaste.getName());
        casteRepository.save(caste);
        return mapToCasteResponse(caste);
    }

    @Override
    public void deleteCaste(Integer id) {
        if (!casteRepository.existsById(id)) {
            throw new IllegalArgumentException("Caste not found with ID: " + id);
        }
        casteRepository.deleteById(id);
    }


    private CasteResponse mapToCasteResponse(Caste caste) {
        return CasteResponse.builder()
                .casteId(caste.getCasteId())
                .name(caste.getName())
                .build();
    }


}
