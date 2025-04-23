package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.model.UserResponse;
import com.ecom.pujakriti.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Integer id) {
        UserResponse userResponse = userService.getUserById(id);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> userResponses = userService.getUsers();
        return new ResponseEntity<>(userResponses, HttpStatus.OK);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Integer userId, @RequestBody UserResponse userResponse) {
        return ResponseEntity.ok(userService.updateUser(userId, userResponse.getName(),userResponse.getPhone()));
    }

}
