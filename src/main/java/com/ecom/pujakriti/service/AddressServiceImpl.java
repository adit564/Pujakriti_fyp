package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.Address;
import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.AddressResponse;
import com.ecom.pujakriti.repository.AddressRepository;
import com.ecom.pujakriti.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;


    @Override
    public AddressResponse createAddress(AddressResponse request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> userAddresses = addressRepository.findByUser_UserId(user.getUserId());
            userAddresses.forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(userAddresses);
        }

        Address address = Address.builder()
                .user(user)
                .city(request.getCity())
                .street(request.getStreet())
                .state(request.getState())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    @Override
    public List<AddressResponse> getUserAddresses(Integer userId) {
        return addressRepository.findByUser_UserId(userId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse updateAddress(Integer addressId, AddressResponse request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setCity(request.getCity());
        address.setStreet(request.getStreet());
        address.setState(request.getState());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> userAddresses = addressRepository.findByUser_UserId(address.getUser().getUserId());
            userAddresses.forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(userAddresses);
            address.setIsDefault(true);
        }

        Address updated = addressRepository.save(address);
        return mapToResponse(updated);
    }

    @Override
    public void deleteAddress(Integer addressId) {
        addressRepository.deleteById(addressId);
    }

    @Override
    public AddressResponse setDefaultAddress(Integer addressId, Integer userId) {
        List<Address> userAddresses = addressRepository.findByUser_UserId(userId);
        userAddresses.forEach(addr -> addr.setIsDefault(false));
        addressRepository.saveAll(userAddresses);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        address.setIsDefault(true);
        Address saved = addressRepository.save(address);

        return mapToResponse(saved);
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .userId(address.getUser().getUserId())
                .city(address.getCity())
                .street(address.getStreet())
                .state(address.getState())
                .isDefault(address.getIsDefault())
                .build();
    }


}
