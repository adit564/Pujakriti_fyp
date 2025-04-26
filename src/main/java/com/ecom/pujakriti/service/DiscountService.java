package com.ecom.pujakriti.service;


import aj.org.objectweb.asm.commons.Remapper;
import com.ecom.pujakriti.model.DiscountCodeRequest;
import com.ecom.pujakriti.model.DiscountCodeResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface DiscountService {

//    public void updateSeasonalDiscounts();

    List<DiscountCodeResponse> getActiveDiscounts();

    List<DiscountCodeResponse> getAllDiscounts();

    DiscountCodeResponse updateDiscountCode(Integer discountId, DiscountCodeRequest discountCodeRequest);

    void deleteDiscountCode(Integer discountId);

    DiscountCodeResponse getDiscountCodeById(Integer discountId);

    DiscountCodeResponse addDiscountCode(DiscountCodeRequest discountCodeRequest);
}
