package com.ecom.pujakriti.repository;

import com.ecom.pujakriti.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer>{
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser_UserId(Integer userId);
}
