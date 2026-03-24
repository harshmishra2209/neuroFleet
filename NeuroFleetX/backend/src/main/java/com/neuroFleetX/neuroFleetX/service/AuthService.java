package com.neuroFleetX.neuroFleetX.service;

import com.neuroFleetX.neuroFleetX.dto.LoginRequest;
import com.neuroFleetX.neuroFleetX.dto.RegisterRequest;
import com.neuroFleetX.neuroFleetX.entity.Role;
import com.neuroFleetX.neuroFleetX.entity.User;
import com.neuroFleetX.neuroFleetX.repository.UserRepository;
import com.neuroFleetX.neuroFleetX.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================

    public String register(RegisterRequest request)
    {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        // IMPORTANT FIX
        if(request.getRole() == Role.ADMIN){
            user.setEnabled(true);
        }else{
            user.setEnabled(false);
        }

        userRepository.save(user);

        if(user.isEnabled()){
            return "Admin registered successfully";
        }else{
            return "Registration successful. Awaiting admin approval.";
        }
    }

    // ================= LOGIN =================

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check approval BEFORE authentication
        if (!user.isEnabled()) {
            throw new RuntimeException("Account not approved by admin");
        }

        // Authenticate credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Generate JWT
        return jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }
}