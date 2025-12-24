package com.lendenclub.transactionservice.controller;

import com.lendenclub.transactionservice.dto.AuthResponse;
import com.lendenclub.transactionservice.dto.LoginRequest;
import com.lendenclub.transactionservice.dto.SignupRequest;
import com.lendenclub.transactionservice.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        // TEMPORARY logic (will be improved later)
        if ("user@example.com".equals(request.getEmail())
                && "password".equals(request.getPassword())) {

            String token = jwtUtil.generateToken(request.getEmail());
            return new AuthResponse(token);
        }

        throw new RuntimeException("Invalid credentials");
    }

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        // TEMP: just return success
        return "User registered successfully";
    }
}
