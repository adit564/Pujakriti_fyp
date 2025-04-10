package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.BundleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BundleService {

    BundleResponse getBundleById(Integer id);

    Page<BundleResponse> getBundles(Pageable pageable, Integer pujaId, Integer guideId, String keyword);


}
