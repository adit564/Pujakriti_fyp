package com.ecom.pujakriti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Puja")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Puja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PujaID")
    private Integer pujaId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Description")
    private String description;
}
