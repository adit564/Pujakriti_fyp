package com.ecom.pujakriti.service;

import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.AdminUserResponse;
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
        return userRepository.findByUserId(id).stream()
                .map(this::convertToUserResponse)
                .toList().getFirst();
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

    @Override
    public List<AdminUserResponse> getUsersForAdmin() {

        log.info("Fetching users");
        List<User> users = userRepository.findAll();

        List<AdminUserResponse> userResponses = users.stream()
                .map(this::convertToAdminUserResponse)
                .collect(Collectors.toList());

        log.info("Users fetched successfully");

        return userResponses;
    }



    @Override
    public UserResponse updateUser(Integer userId,String username, String phone) {
        log.info("Updating user");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));

        user.setName(username);
        user.setPhone(phone);
        User updated = userRepository.save(user);

        return convertToUserResponse(updated);
    }


    @Override
    public AdminUserResponse updateUserActiveStatus(Integer userId, boolean isActive) {
        log.info("Updating user active status for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));
        user.setIsActive(isActive);
        User updated = userRepository.save(user);
        log.info("User active status updated successfully for user ID: {}", userId);
        return convertToAdminUserResponse(updated);
    }


    private UserResponse convertToUserResponse(User user) {

    return UserResponse.builder()
            .name(user.getName())
            .phone(user.getPhone())
            .email(user.getEmail())
            .role(user.getRole().toString())
            .build();
    }

    private AdminUserResponse convertToAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .isActive(user.getIsActive())
                .isEmailVerified(user.isEmailVerified())
                .build();
    }

}
