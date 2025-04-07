package com.ecom.pujakriti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="FAQ")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FAQ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FAQID")
    private Integer faqId;

    @Column(name = "Question", nullable = false)
    private String question;

    @Column(name = "Answer", nullable = false)
    private String answer;
}
