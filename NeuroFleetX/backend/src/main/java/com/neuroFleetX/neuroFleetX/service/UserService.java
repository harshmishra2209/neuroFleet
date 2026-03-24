package com.neuroFleetX.neuroFleetX.service;

import com.neuroFleetX.neuroFleetX.dto.UserResponse;
import com.neuroFleetX.neuroFleetX.entity.Role;
import com.neuroFleetX.neuroFleetX.entity.User;
import com.neuroFleetX.neuroFleetX.exception.ResourceNotFoundException;
import com.neuroFleetX.neuroFleetX.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= GET USERS =================

    public Page<UserResponse> getUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // ================= SEARCH USERS =================

    public Page<UserResponse> searchUsers(String name, Role role, Pageable pageable) {

        if (role != null) {
            return userRepository.findByRole(role, pageable)
                    .map(this::mapToResponse);
        }

        if (name != null && !name.isBlank()) {
            return userRepository.findByNameContainingIgnoreCase(name, pageable)
                    .map(this::mapToResponse);
        }

        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // ================= CHANGE ROLE =================

    public UserResponse changeRole(Long id, Role role) {

        User user = getUser(id);

        user.setRole(role);

        return mapToResponse(userRepository.save(user));
    }

    // ================= ENABLE / DISABLE =================

    public UserResponse toggleUser(Long id) {

        User user = getUser(id);

        user.setEnabled(!user.isEnabled());

        return mapToResponse(userRepository.save(user));
    }

    // ================= RESET PASSWORD =================

    public void resetPassword(Long id, String newPassword) {

        User user = getUser(id);

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    // ================= DELETE =================

    public void deleteUser(Long id) {

        User user = getUser(id);

        userRepository.delete(user);
    }

    private User getUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled()
        );
    }
}