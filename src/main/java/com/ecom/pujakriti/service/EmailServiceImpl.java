package com.ecom.pujakriti.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;


    @Override
    public void sendVerificationEmail(String to, String verificationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verify your email address");
        message.setText("Please click the following link to verify your email: " + verificationLink);

        try {
            mailSender.send(message);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending verification email to {}: {}", to, e.getMessage());
            // Consider more robust error handling (e.g., retries, queueing) in a production environment
        }
    }

    @Override
    public void sendSuggestionEmail(String to, String suggestionMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Bundle suggestion");
        message.setText(suggestionMessage);

        try {
            mailSender.send(message);
            logger.info("Suggestion email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending Suggestion email to {}: {}", to, e.getMessage());
            // Consider more robust error handling (e.g., retries, queueing) in a production environment
        }
    }




    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("You have requested a password reset. Please click the following link to reset your password: " + resetLink +
                "\n\nIf you did not request this, please ignore this email. The link will expire in 1 hour.");
        try {
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Error sending password reset email to {}: {}", toEmail, e.getMessage());
            // Consider more robust error handling
        }
    }

    @Override
    public void sendOrderConfirmationEmailWithAttachment(String to, String subject, String body, String attachmentName, byte[] attachmentBytes) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false); // Set to false for plain text
            helper.addAttachment(attachmentName, new ByteArrayResource(attachmentBytes));
            mailSender.send(message);
            logger.info("Order confirmation email with attachment '{}' sent to: {}", attachmentName, to);
        } catch (MessagingException e) {
            logger.error("Error sending order confirmation email with attachment to {}: {}", to, e.getMessage());
        } catch (MailException e) {
            logger.error("Mail sending failed to {}: {}", to, e.getMessage());
        }
    }




}