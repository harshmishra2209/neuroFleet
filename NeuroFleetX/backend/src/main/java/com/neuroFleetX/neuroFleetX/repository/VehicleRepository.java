package com.neuroFleetX.neuroFleetX.repository;

import com.neuroFleetX.neuroFleetX.entity.Vehicle;
import com.neuroFleetX.neuroFleetX.entity.VehicleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByVehicleNumber(String vehicleNumber);

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    Page<Vehicle> findByStatus(VehicleStatus status, Pageable pageable);

    // ✅ NEW
    List<Vehicle> findByStatus(VehicleStatus status);

    Page<Vehicle> findByModelContainingIgnoreCase(String model, Pageable pageable);

    Page<Vehicle> findByFuelLevelGreaterThanEqual(double fuelLevel, Pageable pageable);
}