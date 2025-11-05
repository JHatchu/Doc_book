package com.doctorapp.repositories;

import com.doctorapp.models.AvailabilityDates;
import com.doctorapp.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<AvailabilityDates, Integer> {
    List<AvailabilityDates> findByDoctor(Doctor doctor);
}