package com.ecom.pujakriti.model;

import lombok.Data;

@Data
public class BundleSuggestionRequest {
    private String name;
    private String email;
    private String bundleName;
    private String bundlePuja;
    private String bundleCaste;
    private String description;
}