package com.ecom.pujakriti.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Caste")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Caste {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CasteID")
    private Long casteId;

    @Column(name = "Name", nullable = false)
    private String name;
}
