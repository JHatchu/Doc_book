package com.doctorapp.services;

import com.doctorapp.models.Appointment;
import com.doctorapp.models.Doctor;
import com.doctorapp.models.User;
import com.doctorapp.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAppointmentsByDoctor(Doctor doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }

    public List<Appointment> getAppointmentsByPatient(User patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Integer id, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
    public Appointment getAppointmentById(Integer id) {
    return appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
}
public Appointment saveAppointment(Appointment appointment) {
    return appointmentRepository.save(appointment);
}

    public void deleteAppointment(Integer id) {
        appointmentRepository.deleteById(id);
    }
}