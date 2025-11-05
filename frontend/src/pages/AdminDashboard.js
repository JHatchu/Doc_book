import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Tabs, Tab, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and is an admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }
    
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await axios.get('http://localhost:8080/api/users');
      setUsers(usersResponse.data);
      
      // Fetch all doctors
      const doctorsResponse = await axios.get('http://localhost:8080/api/doctors');
      setDoctors(doctorsResponse.data);
      
      // Fetch all appointments
      const appointmentsResponse = await axios.get('http://localhost:8080/api/appointments');
      setAppointments(appointmentsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <h2>Admin Dashboard</h2>
      <p>Manage users, doctors, and appointments</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="Users">
          <Card>
            <Card.Header as="h5">All Users</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading users...</p>
              ) : users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="doctors" title="Doctors">
          <Card>
            <Card.Header as="h5">All Doctors</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading doctors...</p>
              ) : doctors.length === 0 ? (
                <p>No doctors found.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td>{doctor.id}</td>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.phone}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="appointments" title="Appointments">
          <Card>
            <Card.Header as="h5">All Appointments</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.doctor.name}</td>
                        <td>{appointment.patient.name}</td>
                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                        <td>{appointment.status}</td>
                        <td>
                          <Button variant="outline-success" size="sm" className="me-2">
                            Approve
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;