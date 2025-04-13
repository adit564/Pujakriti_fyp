package com.ecom.pujakriti.service;


import com.ecom.pujakriti.model.DiscountCodeResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface DiscountService {

    public void updateSeasonalDiscounts();

    List<DiscountCodeResponse> getActiveDiscounts();

}
