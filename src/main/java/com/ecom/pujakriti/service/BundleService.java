package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Bundle;
import com.ecom.pujakriti.model.BundleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface BundleService {

    BundleResponse getBundleById(Integer id);

    Page<BundleResponse> getBundles(Pageable pageable, Integer pujaId, Integer guideId, String keyword);

    List<Bundle> searchBundles(String keyword);

}
