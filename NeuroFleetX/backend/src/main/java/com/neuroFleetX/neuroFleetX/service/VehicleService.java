package com.neuroFleetX.neuroFleetX.service;

import com.neuroFleetX.neuroFleetX.dto.VehicleRequest;
import com.neuroFleetX.neuroFleetX.dto.VehicleResponse;
import com.neuroFleetX.neuroFleetX.entity.Vehicle;
import com.neuroFleetX.neuroFleetX.entity.VehicleStatus;
import com.neuroFleetX.neuroFleetX.exception.ResourceNotFoundException;
import com.neuroFleetX.neuroFleetX.repository.VehicleRepository;
import com.neuroFleetX.neuroFleetX.repository.BookingRepository;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VehicleService {


    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    public VehicleService(VehicleRepository vehicleRepository, BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }

    // ================= CREATE VEHICLE =================

    public VehicleResponse createVehicle(@Valid VehicleRequest request) {

        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new IllegalArgumentException("Vehicle number already exists");
        }

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setModel(request.getModel());
        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());
        vehicle.setSpeed(request.getSpeed());
        vehicle.setFuelLevel(request.getFuelLevel());

        // default business status
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(savedVehicle);
    }

    // ================= GET VEHICLE BY ID =================

    public VehicleResponse getVehicleById(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with id: " + id));

        return mapToResponse(vehicle);
    }

    // ================= GET ALL VEHICLES =================

    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {

        return vehicleRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // ================= UPDATE VEHICLE =================

    public VehicleResponse updateVehicle(Long id, @Valid VehicleRequest updatedVehicle) {

        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with id: " + id));

        existing.setModel(updatedVehicle.getModel());
        existing.setLatitude(updatedVehicle.getLatitude());
        existing.setLongitude(updatedVehicle.getLongitude());
        existing.setSpeed(updatedVehicle.getSpeed());
        existing.setFuelLevel(updatedVehicle.getFuelLevel());

        Vehicle updated = vehicleRepository.save(existing);

        return mapToResponse(updated);
    }

    // ================= DELETE VEHICLE =================

    public void deleteVehicle(Long id) {

        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found"));

        if (existing.getStatus() == VehicleStatus.IN_USE) {
            throw new IllegalStateException("Cannot delete a running vehicle");
        }

        vehicleRepository.delete(existing);
    }

    // ================= SEARCH VEHICLES =================

    public Page<VehicleResponse> searchVehicles(
            String model,
            VehicleStatus status,
            Double minFuel,
            Pageable pageable
    ) {

        if (status != null) {
            return vehicleRepository.findByStatus(status, pageable)
                    .map(this::mapToResponse);
        }

        if (model != null && !model.isBlank()) {
            return vehicleRepository.findByModelContainingIgnoreCase(model, pageable)
                    .map(this::mapToResponse);
        }

        if (minFuel != null) {
            return vehicleRepository.findByFuelLevelGreaterThanEqual(minFuel, pageable)
                    .map(this::mapToResponse);
        }

        return vehicleRepository.findAll(pageable)
                .map(this::mapToResponse);
    }


    public List<VehicleResponse> getAvailableVehicles() {

        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ================= ENTITY → DTO MAPPER =================

    private VehicleResponse mapToResponse(Vehicle vehicle) {

        String activityStatus = vehicle.getSpeed() > 0 ? "RUNNING" : "IDLE";

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getModel(),
                vehicle.getStatus(),
                activityStatus,
                vehicle.getLatitude(),
                vehicle.getLongitude(),
                vehicle.getSpeed(),
                vehicle.getFuelLevel(),
                vehicle.getCreatedAt()
        );
    }

    public Map<String, Long> getVehicleStats() {

        long total = vehicleRepository.count();

        long running = bookingRepository.findByStatusNot("COMPLETED").size();

        long idle = total - running;

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("running", running);
        stats.put("idle", idle);

        return stats;
    }
}