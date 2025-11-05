package com.doctorapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.doctorapp.Dtos.RegisterRequest;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import com.doctorapp.models.UserRole;
import com.doctorapp.services.UserService;
import com.doctorapp.repositories.DoctorRepository;
import com.doctorapp.repositories.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorRepository doctorRepository;

@PostMapping("/register")
public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
    try {
        UserRole role = UserRole.valueOf(request.getRole().toUpperCase());
        User user = new User(request.getName(), request.getEmail(), request.getPassword(), role);

        if (role == UserRole.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setPhone(request.getPhone());
            doctor.setUser(user);
            user.setDoctor(doctor); // link both ways
        }

        User savedUser = userService.registerUser(user); // only save once
        return ResponseEntity.ok(Map.of("message", "Registration successful", "user", savedUser));
    } catch (Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            Map<String, Object> response = userService.loginUser(email, password);

           return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}