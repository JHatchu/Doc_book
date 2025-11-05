package com.doctorapp.services;

import com.doctorapp.models.Doctor;
import com.doctorapp.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public Doctor getDoctorById(Integer id) {
        return doctorRepository.findById(id).orElse(null);
    }
    
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
    
    public void deleteDoctor(Integer id) {
        doctorRepository.deleteById(id);
    }
}