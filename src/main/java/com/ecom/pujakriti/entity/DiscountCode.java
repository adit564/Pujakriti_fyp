package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "DiscountCode")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiscountID")
    private Long discountId;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(name = "DisRate", nullable = false)
    private Double discountRate;

    @Column(name = "IsActive", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive;

    @Column(name = "ExpiryDate")
    private LocalDate expiryDate;
}