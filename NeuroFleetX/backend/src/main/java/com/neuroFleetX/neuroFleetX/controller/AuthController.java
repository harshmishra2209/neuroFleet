package com.neuroFleetX.neuroFleetX.controller;

import com.neuroFleetX.neuroFleetX.dto.LoginRequest;
import com.neuroFleetX.neuroFleetX.dto.RegisterRequest;
import com.neuroFleetX.neuroFleetX.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final AuthService authService;

    public AuthController(AuthService authService)
    {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request)
    {
        return authService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest)
    {
        return authService.login(loginRequest);
    }
}
