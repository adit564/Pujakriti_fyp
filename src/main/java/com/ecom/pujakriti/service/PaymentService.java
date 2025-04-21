package com.ecom.pujakriti.service;

import com.ecom.pujakriti.model.PaymentResponse;

public interface PaymentService {
    String initiatePayment(Integer orderId, String amount);
    PaymentResponse verifyPayment(String orderId, String amount, String transactionId);
    String generateHmacSignature(String data, String secretKey) throws Exception;
}
