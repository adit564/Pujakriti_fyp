package com.ecom.pujakriti.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtHelper {

    public static final long JWT_TOKEN_VALIDITY = 18000; // Token validity (5 hours)

    private static final String JWT_SECRET = "14p54u25j67a31k35r67i125t567i126778"; // Secret key for signing the token


    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject); // Extract username (subject) from token
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration); // Extract expiration date from token
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, userDetails.getUsername()); // Generate JWT token for a user
    }

    private String generateToken(Map<String, Object> claims, String subject) {
        Key hmacKey = new SecretKeySpec(JWT_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Set the username as subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000)) // Set expiration time
                .signWith(hmacKey, SignatureAlgorithm.HS256) // Sign with secret key
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token); // Validate token
    }

    private boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date()); // Check if the token is expired
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims); // Extract specific claim from token
    }

    private Claims getAllClaimsFromToken(String token) {
        Key key = new SecretKeySpec(JWT_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody(); // Parse the JWT token
    }
}
