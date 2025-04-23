package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.BundleCaste;
import com.ecom.pujakriti.entity.Caste;
import com.ecom.pujakriti.model.BundleCasteResponse;
import com.ecom.pujakriti.model.CasteResponse;
import com.ecom.pujakriti.repository.BundleCasteRepository;
import com.ecom.pujakriti.repository.CasteRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BundleCastesServiceImpl implements BundleCasteService {

    @Autowired
    private BundleCasteRepository bundleCasteRepository;

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

    @Override
    public List<CasteResponse> getCastes() {
        log.info("Fetching castes...");

        List<Caste> castes = casteRepository.findAll();

        return castes.stream()
                .map(this::mapToCasteResponse)
                .toList();
    }


    private BundleCasteResponse mapToBundleCasteResponse(BundleCaste bundleCaste) {
        return BundleCasteResponse.builder()
                .id(bundleCaste.getBundleCasteId())
                .bundleId(bundleCaste.getBundle().getBundleId())
                .casteId(bundleCaste.getCaste().getCasteId())
                .build();
    }

    private CasteResponse mapToCasteResponse(Caste caste) {
        return CasteResponse.builder()
                .casteId(caste.getCasteId())
                .name(caste.getName())
                .build();
    }


}
