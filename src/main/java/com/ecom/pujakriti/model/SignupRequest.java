package com.ecom.pujakriti.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
}
