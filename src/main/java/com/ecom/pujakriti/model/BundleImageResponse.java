package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BundleImageResponse {
    private Integer imageId;

    private Integer bundleId;

    private String imageUrl;

    private String name;

}
