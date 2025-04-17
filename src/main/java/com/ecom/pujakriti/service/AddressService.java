package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.AddressResponse;

import java.util.List;

public interface AddressService {

    AddressResponse createAddress(AddressResponse request);
    List<AddressResponse> getUserAddresses(Integer userId);
    AddressResponse updateAddress(Integer addressId, AddressResponse request);
    void deleteAddress(Integer addressId);
    AddressResponse setDefaultAddress(Integer addressId, Integer userId);
}
