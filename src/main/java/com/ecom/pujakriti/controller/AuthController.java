package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.AuthResponse;
import com.ecom.pujakriti.model.LoginRequest;
import com.ecom.pujakriti.model.SignupRequest;
import com.ecom.pujakriti.model.UserResponse;
import com.ecom.pujakriti.repository.UserRepository;
import com.ecom.pujakriti.security.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtHelper jwtHelper;

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        String token = jwtHelper.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.singletonList(() -> "ROLE_" + user.getRole().name())
        ));

        return AuthResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtHelper.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.singletonList(() -> "ROLE_" + user.getRole().name())
        ));

        return AuthResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .user_Id(user.getUserId())
                .build();
    }


}
