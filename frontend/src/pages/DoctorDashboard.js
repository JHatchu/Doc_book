import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState('');
  const navigate = useNavigate();
  
  // Get doctor ID from local storage
  const doctorId = localStorage.getItem('doctorId');
  
  useEffect(() => {
    // Check if user is logged in and is a doctor
    const userRole = localStorage.getItem('userRole');
    if (!doctorId || userRole !== 'DOCTOR') {
      navigate('/login');
      return;
    }
    
    fetchAppointments();
  }, [doctorId, navigate]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      setLoading(false);
      console.error('Error fetching appointments:', err);
    }
  };
  
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/update/${appointmentId}`, {
        status: status
      });
      // Refresh appointments after update
      fetchAppointments();
    } catch (err) {
      setError(`Failed to update appointment status to ${status}. Please try again.`);
      console.error('Error updating appointment status:', err);
    }
  };
  
  const addAvailabilityDate = async () => {
    try {
      await axios.post(`http://localhost:8080/api/availability/add`, {
        doctorId: doctorId,
        availableDate: availabilityDate,
        isBooked: false
      });
      setShowModal(false);
      setAvailabilityDate('');
      // Could add a success message here
    } catch (err) {
      setError('Failed to add availability date. Please try again.');
      console.error('Error adding availability date:', err);
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
          <h2>Doctor Dashboard</h2>
          <p>Manage your appointments and availability</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
          >
            Add Availability
          </Button>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mt-4">
        <Card.Header as="h5">Upcoming Appointments</Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments scheduled.</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patient.name}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      {appointment.status === 'SCHEDULED' && (
                        <>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            className="me-2"
                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                          >
                            Complete
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                          >
                            Cancel
                          </Button>
                        </>
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
       
        <Col>
          <Card>
            <Card.Header as="h5">Feedback</Card.Header>
            <Card.Body>
              <p>View feedback from your patients.</p>
              <Button variant="outline-primary" onClick={() => navigate(`/view-feedback/${doctorId}`)}>View Feedback</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Add Availability Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Select a date and time when you'll be available for appointments.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addAvailabilityDate}>
            Add Availability
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorDashboard;