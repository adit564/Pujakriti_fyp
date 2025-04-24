package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserResponse {
    private Integer userId;
    private String name;
    private String phone;
    private String email;
    private String role;
    private Boolean isActive;
    private Boolean isEmailVerified;
}