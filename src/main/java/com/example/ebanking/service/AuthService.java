// AuthService.java
package com.example.ebanking.service;

import com.example.ebanking.dto.JwtResponse;
import com.example.ebanking.dto.LoginRequest;
import com.example.ebanking.dto.RegisterRequest;
import com.example.ebanking.entity.User;
import com.example.ebanking.repository.UserRepository;
import com.example.ebanking.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        try {
            logger.info("Attempting authentication for email: {}", loginRequest.getEmail());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String jwt = jwtUtil.generateToken(userDetails);
            
            logger.info("JWT token generated successfully");
            
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            
            return new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail());
        } catch (BadCredentialsException e) {
            logger.error("Authentication failed for email: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        } catch (Exception e) {
            logger.error("Unexpected error during authentication: {}", e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public JwtResponse registerAndLoginUser(RegisterRequest registerRequest) {
        try {
            logger.info("Attempting to register user with email: {}", registerRequest.getEmail());
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }

            // Create and save new user
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            User savedUser = userRepository.save(user);
            logger.info("User registered successfully with ID: {}", savedUser.getId());
            
            // Automatically log in the user after registration
            return loginAfterRegistration(registerRequest.getEmail(), registerRequest.getPassword());
            
        } catch (Exception e) {
            logger.error("Error during user registration: {}", e.getMessage());
            throw e;
        }
    }

    private JwtResponse loginAfterRegistration(String email, String password) {
        try {
            logger.info("Auto-login after registration for email: {}", email);
            
            // Authenticate the newly registered user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String jwt = jwtUtil.generateToken(userDetails);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found after registration"));
            
            logger.info("Auto-login successful for user: {}", email);
            
            return new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail());
            
        } catch (Exception e) {
            logger.error("Error during auto-login after registration: {}", e.getMessage());
            throw new RuntimeException("Registration successful but auto-login failed: " + e.getMessage());
        }
    }

    public void logoutUser() {
        SecurityContextHolder.clearContext();
        logger.info("User logged out successfully");
    }

    // Keep the old register method for backward compatibility if needed
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        return userRepository.save(user);
    }
}