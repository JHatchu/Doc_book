package com.doctorapp.services;

import com.doctorapp.models.AvailabilityDates;
import com.doctorapp.models.Doctor;
import com.doctorapp.repositories.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityService {
    
    @Autowired
    private AvailabilityRepository availabilityRepository;
    
    public List<AvailabilityDates> getAllAvailabilityDates() {
        return availabilityRepository.findAll();
    }
    
    public AvailabilityDates getAvailabilityById(Integer id) {
        return availabilityRepository.findById(id).orElse(null);
    }
    
    public List<AvailabilityDates> getAvailabilityByDoctor(Doctor doctor) {
        return availabilityRepository.findByDoctor(doctor);
    }
    
    public AvailabilityDates addAvailabilityDate(AvailabilityDates availabilityDate) {
        return availabilityRepository.save(availabilityDate);
    }
    
    public void deleteAvailabilityDate(Integer id) {
        availabilityRepository.deleteById(id);
    }
}