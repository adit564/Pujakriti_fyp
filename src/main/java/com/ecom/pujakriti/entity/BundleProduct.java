package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BundleProduct")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BundleProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BundleProductID")
    private Long bundleProductId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BundleID", nullable = false)
    private Bundle bundle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ProductID", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;
}