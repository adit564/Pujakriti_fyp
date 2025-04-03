package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BundleCaste")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BundleCaste {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BundleCasteID")
    private Long bundleCasteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BundleID", nullable = false)
    private Bundle bundle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CasteID", nullable = false)
    private Caste caste;
}