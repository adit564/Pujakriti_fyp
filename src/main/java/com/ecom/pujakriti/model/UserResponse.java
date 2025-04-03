package com.ecom.pujakriti.model;

import com.ecom.pujakriti.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long userId;

    private String name;

    private String password;

    private String phone;

    private User.Role role;

    private LocalDateTime createdAt;

    private Boolean isActive;

    public enum Role {
        ADMIN, USER
    }
}
