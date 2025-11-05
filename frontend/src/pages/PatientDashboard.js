import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get patient ID from local storage
  const patientId = localStorage.getItem('userId');
  
  useEffect(() => {
    // Check if user is logged in and is a patient
    const userRole = localStorage.getItem('userRole');
    if (!patientId || userRole !== 'PATIENT') {
      navigate('/login');
      return;
    }
    
    fetchAppointments();
  }, [patientId, navigate]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/appointments/patient/${patientId}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      setLoading(false);
      console.error('Error fetching appointments:', err);
    }
  };
  
  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/cancel/${appointmentId}`);
      // Refresh appointments after cancellation
      fetchAppointments();
    } catch (err) {
      setError('Failed to cancel appointment. Please try again.');
      console.error('Error cancelling appointment:', err);
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'SCHEDULED':
        return <Badge bg="primary">Scheduled</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
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
      <Row>
        <Col>
          <h2>Patient Dashboard</h2>
          <p>Manage your appointments and medical records</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => navigate('/book-appointment')}
          >
            Book New Appointment
          </Button>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mt-4">
        <Card.Header as="h5">My Appointments</Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found. Book your first appointment now!</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>Dr. {appointment.doctor.name}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      {appointment.status === 'SCHEDULED' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {appointment.status === 'COMPLETED' && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate(`/feedback/${appointment.id}`)}
                        >
                          Leave Feedback
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Medical Records</Card.Header>
            <Card.Body>
              <p>Access your medical history and records.</p>
              <Button variant="outline-primary">View Records</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Find Doctors</Card.Header>
            <Card.Body>
              <p>Search for doctors by specialty or location.</p>
              <Button variant="outline-primary" onClick={() => navigate('/doctors')}>
                Find Doctors
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;