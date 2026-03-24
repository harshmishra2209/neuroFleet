package com.neuroFleetX.neuroFleetX.controller;

import com.neuroFleetX.neuroFleetX.dto.VehicleRequest;
import com.neuroFleetX.neuroFleetX.dto.VehicleResponse;
import com.neuroFleetX.neuroFleetX.entity.VehicleStatus;
import com.neuroFleetX.neuroFleetX.response.ApiResponse;
import com.neuroFleetX.neuroFleetX.service.VehicleService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // ================= CREATE VEHICLE =================

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PostMapping
    public ApiResponse<VehicleResponse> create(
            @Valid @RequestBody VehicleRequest request) {

        VehicleResponse vehicle = vehicleService.createVehicle(request);

        return new ApiResponse<>(
                true,
                "Vehicle created successfully",
                vehicle
        );
    }


    // ================= GET VEHICLE BY ID =================

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','DRIVER','CUSTOMER')")
    @GetMapping("/{id}")
    public ApiResponse<VehicleResponse> getById(@PathVariable Long id) {

        VehicleResponse vehicle = vehicleService.getVehicleById(id);

        return new ApiResponse<>(
                true,
                "Vehicle fetched successfully",
                vehicle
        );
    }


    // ================= GET ALL VEHICLES =================

//    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public ApiResponse<Page<VehicleResponse>> getAll(Pageable pageable) {

        Page<VehicleResponse> vehicles =
                vehicleService.getAllVehicles(pageable);

        return new ApiResponse<>(
                true,
                "Vehicles fetched successfully",
                vehicles
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CUSTOMER')")
    @GetMapping("/available")
    public ApiResponse<List<VehicleResponse>> getAvailableVehicles() {

        List<VehicleResponse> vehicles = vehicleService.getAvailableVehicles();

        return new ApiResponse<>(
                true,
                "Available vehicles fetched successfully",
                vehicles
        );
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return vehicleService.getVehicleStats();
    }


    // ================= UPDATE VEHICLE =================

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<VehicleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {

        VehicleResponse vehicle =
                vehicleService.updateVehicle(id, request);

        return new ApiResponse<>(
                true,
                "Vehicle updated successfully",
                vehicle
        );
    }


    // ================= DELETE VEHICLE =================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {

        vehicleService.deleteVehicle(id);

        return new ApiResponse<>(
                true,
                "Vehicle deleted successfully",
                null
        );
    }


    // ================= SEARCH VEHICLES =================

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/search")
    public ApiResponse<Page<VehicleResponse>> searchVehicles(

            @RequestParam(required = false) String model,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) Double minFuel,
            Pageable pageable
    ) {

        Page<VehicleResponse> vehicles =
                vehicleService.searchVehicles(
                        model,
                        status,
                        minFuel,
                        pageable
                );

        return new ApiResponse<>(
                true,
                "Vehicles filtered successfully",
                vehicles
        );
    }
}