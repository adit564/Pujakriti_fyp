package com.ecom.pujakriti.controller;


import com.ecom.pujakriti.model.UserResponse;
import com.ecom.pujakriti.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

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

}
