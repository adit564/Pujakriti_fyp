package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Guide;
import com.ecom.pujakriti.model.GuideResponse;
import com.ecom.pujakriti.repository.GuideRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class GuideServiceImpl implements GuideService {


    @Autowired
    private GuideRepository guideRepository;


    @Override
    public List<GuideResponse> getGuides() {
        log.info("Fetching Guides");

        List<Guide> guides = guideRepository.findAll();

        List<GuideResponse> guideResponses = guides.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        log.info("Guides fetched successfully");

        return guideResponses;
    }

    private GuideResponse convertToResponse(Guide guide) {
        return GuideResponse.builder()
                .guideId(guide.getGuideId())
                .name(guide.getName())
                .description(guide.getDescription())
                .content(guide.getContent())
                .pujaId(guide.getPuja().getPujaId())
                .build();
    }
}
