package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GuideResponse {
    private Integer guideId;

    private String name;

    private String description;

    private String content;

    private Integer pujaId;

}
