package com.doctorapp.services;

import com.doctorapp.models.User;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.UserRole;
import com.doctorapp.repositories.UserRepository;
import com.doctorapp.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
           
        
        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        // In a real app, you would generate a JWT token here
        response.put("token", "dummy-jwt-token-" + user.getId());
   if (user.getRole() == UserRole.DOCTOR) {
    Doctor doctor = doctorRepository.findByUserId(user.getId());
    if (doctor != null) {
        response.put("doctorId", doctor.getId());
    }
}
        return response;
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}