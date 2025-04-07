package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.UserResponse;
import com.ecom.pujakriti.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Log4j2
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getUserById(Integer id) {
        return null;
    }

    @Override
    public List<UserResponse> getUsers() {

        log.info("Fetching users");
        List<User> users = userRepository.findAll();

        List<UserResponse> userResponses = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());

        log.info("Users fetched successfully");

        return userResponses;
    }

    private UserResponse convertToUserResponse(User user) {

    return UserResponse.builder()
            .userId(user.getUserId())
            .name(user.getName())
            .phone(user.getPhone())
            .email(user.getEmail())
            .role(user.getRole())
            .isActive(user.getIsActive())
            .build();
    }

}
