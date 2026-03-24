package com.neuroFleetX.neuroFleetX.controller;

import com.neuroFleetX.neuroFleetX.entity.Booking;
import com.neuroFleetX.neuroFleetX.service.BookingService;
import com.neuroFleetX.neuroFleetX.service.VehicleService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final VehicleService vehicleService;
    private final BookingService bookingService;

    public BookingController(VehicleService vehicleService, BookingService bookingService) {
        this.vehicleService = vehicleService;
        this.bookingService = bookingService;
    }

    // ================= CREATE =================
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // ================= GET ALL =================
    @PreAuthorize("hasAnyRole('CUSTOMER','DRIVER','ADMIN','MANAGER')")
    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getAllBookings();
    }

    // ================= COMPLETE =================
    @PreAuthorize("hasAnyRole('CUSTOMER','DRIVER')")
    @PutMapping("/{id}/complete")
    public Booking completeBooking(@PathVariable Long id) {
        return bookingService.markAsCompleted(id);
    }

    // ================= DRIVER DASHBOARD =================
    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/driver-dashboard")
    public Map<String, Object> getDriverDashboard() {

        return Map.of(
                "tripsToday", bookingService.getTodayTrips(),
                "earningsToday", bookingService.getTodayEarnings()
        );
    }

    // ================= STATS =================
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return vehicleService.getVehicleStats();
    }
}