package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.entity.User;
import com.ecom.pujakriti.model.BundleSuggestionRequest;
import com.ecom.pujakriti.repository.UserRepository;
import com.ecom.pujakriti.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communication")
@CrossOrigin(origins = "http://localhost:3000")
public class CommunicationController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    private String findAdminEmail() {
        List<User> admins = userRepository.findAllByRole(User.Role.ADMIN);
        if (admins.isEmpty()) {
            throw new RuntimeException("No admin user found.");
        }
        return admins.get(0).getEmail(); // Assuming at least one admin exists
    }

    @PostMapping("/bundle-suggestion")
    public ResponseEntity<String> sendBundleSuggestion(@RequestBody BundleSuggestionRequest request) {
        String adminEmail = findAdminEmail();
        String subject = "New Bundle Suggestion: " + request.getBundleName();
        String body =
                "Username: " + request.getName() + "\n" +
                "Email: " + request.getEmail() + "\n" +
                "Bundle Name: " + request.getBundleName() + "\n" +
                "Puja: " + request.getBundlePuja() + "\n" +
                "Caste: " + request.getBundleCaste() + "\n" +
                "Description: " + request.getDescription();
        emailService.sendSuggestionEmail(adminEmail, body);

        return ResponseEntity.ok("Bundle suggestion sent successfully.");
    }


}
