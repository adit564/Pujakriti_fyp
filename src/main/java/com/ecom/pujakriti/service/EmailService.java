package com.ecom.pujakriti.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationLink);
    void sendPasswordResetEmail(String toEmail, String resetLink);

    void sendOrderConfirmationEmailWithAttachment(String to, String subject, String body, String attachmentName, byte[] attachmentBytes);
    void sendSuggestionEmail(String to, String suggestionMessage);

}
