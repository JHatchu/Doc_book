package com.doctorapp.controllers;



import com.doctorapp.models.Appointment;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.Feedback;
import com.doctorapp.models.User;
import com.doctorapp.services.AppointmentService;
import com.doctorapp.services.DoctorService;
import com.doctorapp.services.FeedbackService;
import com.doctorapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

  @PostMapping("/add")
public ResponseEntity<?> addFeedback(@RequestBody Map<String, Object> request) {
    try {
        Integer appointmentId = Integer.parseInt(request.get("appointmentId").toString());
        Integer patientId = Integer.parseInt(request.get("patientId").toString());
        Integer rating = Integer.parseInt(request.get("rating").toString());
        String comments = request.get("comments").toString();

        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        Doctor doctor = appointment.getDoctor(); // ✅ get doctor from appointment
        User patient = userService.getUserById(patientId);

        Feedback feedback = new Feedback();
        feedback.setAppointment(appointment);
        feedback.setDoctor(doctor);
        feedback.setPatient(patient);
        feedback.setRating(rating);
        feedback.setComments(comments);

        return ResponseEntity.ok(feedbackService.addFeedback(feedback));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to add feedback: " + e.getMessage()));
    }
}

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Feedback>> getFeedbackByDoctor(@PathVariable Integer doctorId) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(feedbackService.getFeedbackByDoctor(doctor));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Feedback>> getFeedbackByPatient(@PathVariable Integer patientId) {
        User patient = userService.getUserById(patientId);
        return ResponseEntity.ok(feedbackService.getFeedbackByPatient(patient));
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }


}
