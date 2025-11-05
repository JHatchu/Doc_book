package com.doctorapp.models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private String name;
    private String specialization;
    private String email;
    private String phone;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonManagedReference

    private Set<AvailabilityDates> availabilityDates = new HashSet<>();
@OneToOne
@JoinColumn(name = "user_id", referencedColumnName = "id")
@JsonBackReference
private User user;

    public Doctor() {
    }

    public Doctor(String name, String specialization, String email, String phone) {
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.phone = phone;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<AvailabilityDates> getAvailabilityDates() {
        return availabilityDates;
    }

    public void setAvailabilityDates(Set<AvailabilityDates> availabilityDates) {
        this.availabilityDates = availabilityDates;
    }
      public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

}