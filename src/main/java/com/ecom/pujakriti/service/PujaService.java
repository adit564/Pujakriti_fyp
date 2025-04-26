package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.PujaResponse;

import java.util.List;

public interface PujaService {
    List<PujaResponse> getPujas();
    PujaResponse findPujaById(Integer pujaId);
    PujaResponse updatePuja(Integer pujaId, PujaResponse updatedPuja);
}
