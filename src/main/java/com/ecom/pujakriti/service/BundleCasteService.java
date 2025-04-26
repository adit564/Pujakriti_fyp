package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.BundleCasteRequest;
import com.ecom.pujakriti.model.BundleCasteResponse;
import com.ecom.pujakriti.model.CasteResponse;

import java.util.List;

public interface BundleCasteService {

    List<BundleCasteResponse> getBundleCastes();
    BundleCasteResponse addBundleCaste(BundleCasteRequest bundleCasteRequest);
    BundleCasteResponse updateBundleCaste(Integer id, BundleCasteRequest bundleCasteRequest);
    void deleteBundleCaste(Integer id);


    List<CasteResponse> getCastes();

    CasteResponse getCasteById(Integer id);

    CasteResponse addCaste(CasteResponse casteResponse);

    CasteResponse updateCaste(Integer id, CasteResponse updateCaste);

    void deleteCaste(Integer id);
}
