package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.DiscountCode;
import com.ecom.pujakriti.model.DiscountCodeResponse;
import com.ecom.pujakriti.repository.DiscountCodeRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@Log4j2
public class DiscountServiceImpl implements DiscountService {

    private final DiscountCodeRepository discountCodeRepository;

    public DiscountServiceImpl(DiscountCodeRepository discountCodeRepository) {
        this.discountCodeRepository = discountCodeRepository;
    }


    @Override
    public List<DiscountCodeResponse> getActiveDiscounts() {
        log.info("Fetching active discounts");
        return discountCodeRepository.findAll().stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsActive()))
                .map(this::convertToResponse)
                .toList();
    }

    private DiscountCodeResponse convertToResponse(DiscountCode discountCode) {
       return DiscountCodeResponse.builder()
                .discountId(discountCode.getDiscountId())
                .code(discountCode.getCode())
                .discountRate(discountCode.getDiscountRate())
                .isActive(discountCode.getIsActive())
                .expiryDate(discountCode.getExpiryDate())
                .build();
    }


    @Override
//    @Scheduled(cron = "0 0 0 * * *")
    @Scheduled(cron = "0 * * * * *")
    public void updateSeasonalDiscounts() {
        LocalDate today = LocalDate.now();

        // Dashain
        activateCode("DASHAIN2025", today, LocalDate.of(2025, 9, 25), LocalDate.of(2025, 10, 15));

        // Tihar
        activateCode("TIHAR2025", today, LocalDate.of(2025, 11, 1), LocalDate.of(2025, 11, 10));

        // Chhath
        activateCode("CHHATH2025", today, LocalDate.of(2025, 10, 27), LocalDate.of(2025, 10, 30));

        // Holi
        activateCode("HOLI2025", today, LocalDate.of(2025, 3, 20), LocalDate.of(2025, 3, 26));

        // New Year Offer
        activateCode("NEWYEAR2025", today, LocalDate.of(2025, 4, 11), LocalDate.of(2025, 4, 19));

        // Buddha Jayanti
        activateCode("BUDDHA2025", today, LocalDate.of(2025, 4, 21), LocalDate.of(2025, 5, 15));

        // Teej Festival
        activateCode("TEEJ2025", today, LocalDate.of(2025, 8, 20), LocalDate.of(2025, 8, 25));

    }


    private void activateCode(String code, LocalDate today, LocalDate start, LocalDate end) {
        discountCodeRepository.findByCode(code).ifPresent(discount -> {
            boolean shouldBeActive = !today.isBefore(start) && !today.isAfter(end);
            if (!Objects.equals(discount.getIsActive(), shouldBeActive)) {
                discount.setIsActive(shouldBeActive);
                discountCodeRepository.save(discount);
            }
        });
    }


}
