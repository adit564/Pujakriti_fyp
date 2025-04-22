package com.ecom.pujakriti.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationLink);
    void sendPasswordResetEmail(String toEmail, String resetLink);
}
