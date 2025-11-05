package com.doctorapp.controllers;

import com.doctorapp.models.AvailabilityDates;
import com.doctorapp.models.Doctor;
import com.doctorapp.services.AvailabilityService;
import com.doctorapp.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private DoctorService doctorService;

    // DTOs declared as static inner classes to keep it simple
    public static class AvailabilityCreateRequest {
        public Integer doctorId;
        public LocalDate availableDate;
        public Boolean isBooked; // optional, defaults to false
    }

    public static class AvailabilityResponse {
        public Integer id;
        public LocalDate availableDate;
        public boolean booked;

        public AvailabilityResponse(Integer id, LocalDate availableDate, boolean booked) {
            this.id = id;
            this.availableDate = availableDate;
            this.booked = booked;
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAvailability(@RequestBody AvailabilityCreateRequest request) {
        if (request == null || request.doctorId == null || request.availableDate == null) {
            return new ResponseEntity<>("doctorId and availableDate are required", HttpStatus.BAD_REQUEST);
        }
        Doctor doctor = doctorService.getDoctorById(request.doctorId);
        if (doctor == null) {
            return new ResponseEntity<>("Doctor not found", HttpStatus.NOT_FOUND);
        }

        AvailabilityDates availability = new AvailabilityDates();
        // Store single-day availability as fromDate=endDate
        availability.setFromDate(request.availableDate);
        availability.setEndDate(request.availableDate);
        availability.setDoctor(doctor);

        AvailabilityDates saved = availabilityService.addAvailabilityDate(availability);
        boolean booked = request.isBooked != null ? request.isBooked : false;
        AvailabilityResponse resp = new AvailabilityResponse(saved.getAvailabilityId(), saved.getFromDate(), booked);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAvailabilityByDoctor(@PathVariable Integer doctorId) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            return new ResponseEntity<>("Doctor not found", HttpStatus.NOT_FOUND);
        }
        List<AvailabilityDates> dates = availabilityService.getAvailabilityByDoctor(doctor);
        List<AvailabilityResponse> resp = new ArrayList<>();
        for (AvailabilityDates a : dates) {
            // booked flag not persisted yet; default to false for now
            resp.add(new AvailabilityResponse(a.getAvailabilityId(), a.getFromDate(), false));
        }
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AvailabilityDates>> getAllAvailability() {
        return new ResponseEntity<>(availabilityService.getAllAvailabilityDates(), HttpStatus.OK);
    }
}