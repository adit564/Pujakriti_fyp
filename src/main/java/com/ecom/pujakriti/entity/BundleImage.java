package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Bundlelmage") // Note: Fix typo in table name if needed
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BundleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImageID")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BundleID", nullable = false)
    private Bundle bundle;

    @Column(name = "ImageURL", nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String name;
}