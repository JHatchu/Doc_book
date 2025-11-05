package com.doctorapp.repositories;

import com.doctorapp.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
        Doctor findByEmail(String email);
        Doctor findByUserId(int userId);
}