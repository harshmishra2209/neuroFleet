package com.neuroFleetX.neuroFleetX.repository;

import com.neuroFleetX.neuroFleetX.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStatusNot(String status);

    // 🔥 for dashboard
    List<Booking> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}