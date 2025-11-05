package com.doctorapp.repositories;

import com.doctorapp.models.Appointment;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(User patient);
}