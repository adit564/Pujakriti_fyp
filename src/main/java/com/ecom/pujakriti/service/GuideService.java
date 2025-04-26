package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.GuideResponse;
import com.ecom.pujakriti.model.PujaResponse;

import java.util.List;

public interface GuideService {


    List<GuideResponse> getGuides();

    GuideResponse getGuideById(Integer guideId);

    GuideResponse updateGuide(Integer guideId, GuideResponse updatedGuide);
}
