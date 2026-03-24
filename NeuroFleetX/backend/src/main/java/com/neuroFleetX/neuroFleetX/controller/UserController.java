package com.neuroFleetX.neuroFleetX.controller;

import com.neuroFleetX.neuroFleetX.dto.UserResponse;
import com.neuroFleetX.neuroFleetX.entity.Role;
import com.neuroFleetX.neuroFleetX.response.ApiResponse;
import com.neuroFleetX.neuroFleetX.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================= GET USERS =================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<Page<UserResponse>> getUsers(Pageable pageable) {

        return new ApiResponse<>(
                true,
                "Users fetched",
                userService.getUsers(pageable)
        );
    }

    // ================= SEARCH USERS =================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ApiResponse<Page<UserResponse>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Role role,
            Pageable pageable
    ) {

        return new ApiResponse<>(
                true,
                "Users filtered",
                userService.searchUsers(name, role, pageable)
        );
    }

    // ================= CHANGE ROLE =================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ApiResponse<UserResponse> changeRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {

        return new ApiResponse<>(
                true,
                "Role updated",
                userService.changeRole(id, role)
        );
    }

    // ================= ENABLE / DISABLE =================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/toggle")
    public ApiResponse<UserResponse> toggleUser(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "User status changed",
                userService.toggleUser(id)
        );
    }

    // ================= RESET PASSWORD =================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reset-password")
    public ApiResponse<String> resetPassword(
            @PathVariable Long id,
            @RequestParam String newPassword
    ) {

        userService.resetPassword(id, newPassword);

        return new ApiResponse<>(
                true,
                "Password reset successfully",
                null
        );
    }

    // ================= DELETE =================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return new ApiResponse<>(
                true,
                "User deleted",
                null
        );
    }


}