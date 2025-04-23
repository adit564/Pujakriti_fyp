package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.BundleCasteResponse;
import com.ecom.pujakriti.model.CasteResponse;

import java.util.List;

public interface BundleCasteService {

    List<BundleCasteResponse> getBundleCastes();

    List<CasteResponse> getCastes();

}
