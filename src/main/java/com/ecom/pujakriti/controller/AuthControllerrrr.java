//package com.ecom.pujakriti.controller;
//
//import com.ecom.pujakriti.model.JwtRequest;
//import com.ecom.pujakriti.model.JwtResponse;
//import com.ecom.pujakriti.security.JwtHelper;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthControllerrrr {
//
//    private final JwtHelper jwtHelper;
//    private final UserDetailsService userDetailsService;
//    private final AuthenticationManager authenticationManager;
//
//
//    public AuthControllerrrr(JwtHelper jwtHelper, UserDetailsService userDetailsService, AuthenticationManager authenticationManager) {
//        this.jwtHelper = jwtHelper;
//        this.userDetailsService = userDetailsService;
//        this.authenticationManager = authenticationManager;
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest loginRequest) {
//        this.authenticate(loginRequest.getUsername(),loginRequest.getPassword());
//        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
//        String token = jwtHelper.generateToken(userDetails);
//        JwtResponse jwtResponse = JwtResponse.builder()
//                        .username(userDetails.getUsername())
//                        .token(token)
//                        .build();
//        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
//    }
//
//    @GetMapping("/user")
//    public ResponseEntity<UserDetails> getUserDetails(@RequestHeader("Authorization") String tokenHeader) {
//        String token = extractTokenFromHeader(tokenHeader);
//        if (token != null) {
//            String username = jwtHelper.getUsernameFromToken(token);
//            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//            return new ResponseEntity<>(userDetails, HttpStatus.OK);
//        }else {
//            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
//        }
//    }
//
//    private String extractTokenFromHeader(String tokenHeader) {
//        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
//            return tokenHeader.substring(7);
//        }else {
//            return null;
//        }
//    }
//
//    private void authenticate(String username, String password) {
//        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
//        try {
//            authenticationManager.authenticate(authenticationToken);
//        }catch (BadCredentialsException e){
//            throw new BadCredentialsException("Invalid username or password");
//        }
//    }
//
//
//}
