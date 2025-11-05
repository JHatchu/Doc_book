package com.doctorapp.repositories;

import com.doctorapp.models.Feedback;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByDoctor(Doctor doctor);
    List<Feedback> findByPatient(User patient);
}
