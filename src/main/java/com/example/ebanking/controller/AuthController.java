// AuthController.java
package com.example.ebanking.controller;

import com.example.ebanking.dto.JwtResponse;
import com.example.ebanking.dto.LoginRequest;
import com.example.ebanking.dto.RegisterRequest;
import com.example.ebanking.entity.User;
import com.example.ebanking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Use the new method that registers AND logs in the user
            JwtResponse jwtResponse = authService.registerAndLoginUser(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered and logged in successfully!");
            response.put("token", jwtResponse.getToken());
            response.put("user", Map.of(
                "id", jwtResponse.getId(),
                "name", jwtResponse.getName(),
                "email", jwtResponse.getEmail()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Keep the old register endpoint for backward compatibility
    @PostMapping("/register-old")
    public ResponseEntity<?> registerUserOld(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully! Please log in.");
            response.put("email", user.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        authService.logoutUser();
        Map<String, String> response = new HashMap<>();
        response.put("message", "User logged out successfully!");
        return ResponseEntity.ok(response);
    }
}