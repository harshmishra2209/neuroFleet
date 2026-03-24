package com.neuroFleetX.neuroFleetX.repository;

import com.neuroFleetX.neuroFleetX.entity.Role;
import com.neuroFleetX.neuroFleetX.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // used by login
    Optional<User> findByEmail(String email);

    // used by admin filters
    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);

}