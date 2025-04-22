package com.ecom.pujakriti.controller;

import com.ecom.pujakriti.entity.PasswordResetToken;
import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.entity.VerificationToken;
import com.ecom.pujakriti.model.AuthResponse;
import com.ecom.pujakriti.model.LoginRequest;
import com.ecom.pujakriti.model.ResetPasswordRequest;
import com.ecom.pujakriti.model.SignupRequest;
import com.ecom.pujakriti.repository.PasswordResetTokenRepository;
import com.ecom.pujakriti.repository.UserRepository;
import com.ecom.pujakriti.repository.VerificationTokenRepository;
import com.ecom.pujakriti.security.JwtHelper;
import com.ecom.pujakriti.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

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

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isActive(true) // Default to true, admin can disable
                .isEmailVerified(false) // Initially false
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDateTime(LocalDateTime.now().plusHours(24));
        verificationTokenRepository.save(verificationToken);

        String verificationLink = "http://localhost:8081/api/auth/verify-email?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);

        return ResponseEntity.ok(AuthResponse.builder()
                .email(user.getEmail())
                .message("Signup successful. Please check your email to verify your account.")
                .build());
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification token"));

        if (verificationToken.getExpiryDateTime().isBefore(LocalDateTime.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new ResponseStatusException(HttpStatus.GONE, "Verification token has expired. Please request a new one if needed.");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Email verified successfully! You can now log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please verify your email address before logging in.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials. Please check your email address and password.");
        }

        String token = jwtHelper.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.singletonList(() -> "ROLE_" + user.getRole().name())
        ));

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .user_Id(user.getUserId())
                .build());
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody LoginRequest request) { // Using LoginRequest for email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with this email not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setUser(user);
        passwordResetToken.setExpiryDateTime(LocalDateTime.now().plusHours(1)); // Token expires in 1 hour
        passwordResetTokenRepository.save(passwordResetToken);

        String resetLink = "https://localhost:3000/reset-password?token=" + token; // Adjust your frontend reset password URL
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok(AuthResponse.builder()
                .email(user.getEmail())
                .message("A password reset link has been sent to your email address.")
                .build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token"));

        if (passwordResetToken.getExpiryDateTime().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(passwordResetToken);
            throw new ResponseStatusException(HttpStatus.GONE, "Reset token has expired. Please request a new one.");
        }

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(passwordResetToken); // Delete the used token

        return ResponseEntity.ok(AuthResponse.builder()
                .email(user.getEmail())
                .message("Password reset successfully. You can now log in with your new password.")
                .build());
    }

}