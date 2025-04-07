package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.UserResponse;

import java.util.List;

public interface UserService {


    UserResponse getUserById(Integer id);

    List<UserResponse> getUsers();
}
