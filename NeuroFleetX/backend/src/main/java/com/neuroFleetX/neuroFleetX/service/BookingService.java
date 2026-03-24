package com.neuroFleetX.neuroFleetX.service;

import com.neuroFleetX.neuroFleetX.entity.Booking;
import com.neuroFleetX.neuroFleetX.entity.Vehicle;
import com.neuroFleetX.neuroFleetX.entity.VehicleStatus;
import com.neuroFleetX.neuroFleetX.repository.BookingRepository;
import com.neuroFleetX.neuroFleetX.repository.VehicleRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    // ================= CREATE BOOKING =================
    public Booking createBooking(Booking booking) {

        if (booking.getVehicle() == null || booking.getVehicle().getId() == null) {
            throw new RuntimeException("Vehicle is required");
        }

        Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        booking.setVehicle(vehicle);

        vehicle.setStatus(VehicleStatus.IN_USE);
        vehicleRepository.save(vehicle);

        booking.setStatus("CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // ================= GET ALL =================
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ================= COMPLETE =================
    public Booking markAsCompleted(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("COMPLETED");

        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    // ================= DASHBOARD =================
    public List<Booking> getTodayBookings() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return bookingRepository.findByCreatedAtBetween(start, end);
    }

    public long getTodayTrips() {
        return getTodayBookings().size();
    }

    public double getTodayEarnings() {
        return getTodayBookings()
                .stream()
                .mapToDouble(Booking::getFare)
                .sum();
    }

    public long getRunningVehiclesCount() {
        return bookingRepository.findByStatusNot("COMPLETED").size();
    }
}