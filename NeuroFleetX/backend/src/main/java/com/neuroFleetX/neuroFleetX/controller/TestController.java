package com.neuroFleetX.neuroFleetX.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnly() {
        return "Only ADMIN can access this!";
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public String managerOnly() {
        return "Only MANAGER can access this!";
    }

    @GetMapping("/user")
    public String anyAuthenticatedUser() {
        return "Any authenticated user!";
    }
}