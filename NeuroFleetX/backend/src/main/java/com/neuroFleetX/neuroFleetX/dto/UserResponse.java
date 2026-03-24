package com.neuroFleetX.neuroFleetX.dto;

import com.neuroFleetX.neuroFleetX.entity.Role;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean enabled;

    public UserResponse(Long id, String name, String email, Role role, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public Role getRole() { return role; }

    public boolean isEnabled() { return enabled; }
}