import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const patientId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    // Check if user is logged in and is a patient
    if (!patientId || userRole !== 'PATIENT') {
      navigate('/login');
      return;
    }
    
    fetchDoctors();
  }, [patientId, userRole, navigate]);
  
  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailableDates(selectedDoctor);
    } else {
      setAvailableDates([]);
    }
  }, [selectedDoctor]);
  
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/doctors');
      setDoctors(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors. Please try again later.');
      setLoading(false);
      console.error('Error fetching doctors:', err);
    }
  };
  
  const fetchAvailableDates = async (doctorId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/availability/doctor/${doctorId}`);
      // Filter only available dates (not booked)
      const availableDates = response.data.filter(date => !date.booked);
      setAvailableDates(availableDates);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch available dates. Please try again later.');
      setLoading(false);
      console.error('Error fetching available dates:', err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
      e.stopPropagation();
    if (!selectedDoctor || !selectedDate) {
      setError('Please select a doctor and an available date.');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/appointments/book', {
        patientId: patientId,
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        status: 'SCHEDULED'
      });

      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Error booking appointment:', err);
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="mt-4 mb-5">
      <h2>Book an Appointment</h2>
      <p>Select a doctor and an available time slot</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select 
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={!!doctorId}
                required
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            {selectedDoctor && (
              <Form.Group className="mb-3">
                <Form.Label>Select Available Date & Time</Form.Label>
                {availableDates.length === 0 ? (
                  <Alert variant="info">
                    No available time slots for this doctor. Please select another doctor or check back later.
                  </Alert>
                ) : (
                  <Row>
                    {availableDates.map(date => (
                      <Col md={6} key={date.id} className="mb-2">
                        <Card 
                          className={`p-2 ${selectedDate === date.availableDate ? 'bg-primary text-white' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedDate(date.availableDate)}
                        >
                          {formatDate(date.availableDate)}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !selectedDoctor || !selectedDate}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookAppointment;