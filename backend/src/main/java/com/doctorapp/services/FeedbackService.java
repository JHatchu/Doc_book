package com.doctorapp.services;



import com.doctorapp.models.Feedback;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import com.doctorapp.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbackByDoctor(Doctor doctor) {
        return feedbackRepository.findByDoctor(doctor);
    }

    public List<Feedback> getFeedbackByPatient(User patient) {
        return feedbackRepository.findByPatient(patient);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
