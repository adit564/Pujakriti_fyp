package com.ecom.pujakriti.model;


import com.ecom.pujakriti.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {

    private Integer addressId;

    private Integer userId;

    private String city;

    private String street;

    private String state;

    private Boolean isDefault;
}
