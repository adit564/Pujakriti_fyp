package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Puja;
import com.ecom.pujakriti.exceptions.ProductNotFoundException;
import com.ecom.pujakriti.model.PujaResponse;
import com.ecom.pujakriti.repository.PujaRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class PujaServiceImpl implements PujaService {

    @Autowired
    private PujaRepository pujaRepository;

    @Override
    public List<PujaResponse> getPujas() {
        log.info("Fetching pujas");

        List<Puja> pujas = pujaRepository.findAll();

        List<PujaResponse> pujasResponses = pujas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        log.info("Pujas fetched successfully");

        return pujasResponses;
    }

    @Override
    public PujaResponse findPujaById(Integer pujaId) {
        Puja puja =  pujaRepository.findById(pujaId)
                .orElseThrow(() -> new ProductNotFoundException("Puja not found with id: " + pujaId));
        return convertToResponse(puja);
    }

    @Override
    public PujaResponse updatePuja(Integer pujaId, PujaResponse updatedPuja) {
        Puja existingPuja = pujaRepository.findById(pujaId)
                .orElseThrow(() -> new ProductNotFoundException("Puja not found with id: " + pujaId));
        existingPuja.setName(updatedPuja.getName());
        existingPuja.setDescription(updatedPuja.getDescription());
        pujaRepository.save(existingPuja);
        return convertToResponse(existingPuja);
    }

    public PujaResponse convertToResponse(Puja puja) {
        return PujaResponse.builder()
                .pujaId(puja.getPujaId())
                .name(puja.getName())
                .description(puja.getDescription())
                .build();
    }

}
