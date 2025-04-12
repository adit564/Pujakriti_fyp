package com.ecom.pujakriti.model;


import com.ecom.pujakriti.entity.Guide;
import com.ecom.pujakriti.entity.Puja;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BundleResponse {
    private Integer bundleId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String guide;
    private String puja;
}
