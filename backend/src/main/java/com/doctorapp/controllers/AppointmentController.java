package com.doctorapp.controllers;

import com.doctorapp.models.Appointment;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import com.doctorapp.services.AppointmentService;
import com.doctorapp.services.DoctorService;
import com.doctorapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserService userService;

    // Get appointments for a doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Integer doctorId) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctor));
    }

    // Get appointments for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Integer patientId) {
        User patient = userService.getUserById(patientId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patient));
    }

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> request) {
        try {
            Integer doctorId = Integer.parseInt(request.get("doctorId").toString());
            Integer patientId = Integer.parseInt(request.get("patientId").toString());
            String appointmentDateStr = request.get("appointmentDate").toString();
            String statusStr = request.get("status").toString();

            Doctor doctor = doctorService.getDoctorById(doctorId);
            User patient = userService.getUserById(patientId);

            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setAppointmentDate(java.time.LocalDateTime.parse(appointmentDateStr + "T00:00:00"));
            appointment.setStatus(Appointment.AppointmentStatus.valueOf(statusStr));

            return ResponseEntity.ok(appointmentService.createAppointment(appointment));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create appointment: " + e.getMessage()));
        }
    }

    // Update appointment status
    @PutMapping("/update/{id}")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Appointment.AppointmentStatus appointmentStatus = Appointment.AppointmentStatus.valueOf(status);
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, appointmentStatus));
    }

    // Delete appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    // Cancel appointment
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Appointment not found with id: " + id));
            }

            // ✅ Corrected: use setter instead of undefined method
            appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
            appointmentService.saveAppointment(appointment);

            return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to cancel appointment: " + e.getMessage()));
        }
    }
}
