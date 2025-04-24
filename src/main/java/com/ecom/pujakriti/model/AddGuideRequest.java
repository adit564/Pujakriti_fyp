package com.ecom.pujakriti.model;
import lombok.Data;

@Data
public class AddGuideRequest {
    private String name;
    private String description;
    private String content;
}