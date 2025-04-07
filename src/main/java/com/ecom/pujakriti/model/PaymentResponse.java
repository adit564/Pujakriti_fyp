package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.Order;
import com.ecom.pujakriti.entity.Payment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Integer paymentId;

    private Order order;

    private String transactionId;

    private Double amount;

    private Payment.PaymentStatus status;

    private LocalDateTime paymentDate;

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}
