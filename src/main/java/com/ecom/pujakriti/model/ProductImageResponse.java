package com.ecom.pujakriti.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageResponse {

    private Integer imageId;

    private Integer productId;

    private String imageUrl;

    private String name;
}
