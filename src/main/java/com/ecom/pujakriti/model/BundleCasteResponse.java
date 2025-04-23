package com.ecom.pujakriti.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BundleCasteResponse {
    private Integer id;
    private Integer bundleId;
    private Integer casteId;
}
