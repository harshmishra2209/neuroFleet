package com.neuroFleetX.neuroFleetX.dto;

import com.neuroFleetX.neuroFleetX.entity.VehicleStatus;
import java.time.LocalDateTime;

public class VehicleResponse {

    private Long id;
    private String vehicleNumber;
    private String model;
    private VehicleStatus status;
    private String activityStatus;
    private double latitude;
    private double longitude;
    private double speed;
    private double fuelLevel;
    private LocalDateTime createdAt;

    public VehicleResponse(
            Long id,
            String vehicleNumber,
            String model,
            VehicleStatus status,
            String activityStatus,
            double latitude,
            double longitude,
            double speed,
            double fuelLevel,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.model = model;
        this.status = status;
        this.activityStatus = activityStatus;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.fuelLevel = fuelLevel;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getVehicleNumber() { return vehicleNumber; }
    public String getModel() { return model; }
    public VehicleStatus getStatus() { return status; }
    public String getActivityStatus() { return activityStatus; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public double getSpeed() { return speed; }
    public double getFuelLevel() { return fuelLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}