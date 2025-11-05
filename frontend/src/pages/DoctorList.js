import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [specialties, setSpecialties] = useState([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/doctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      
      // Extract unique specialties for filter dropdown
      const uniqueSpecialties = [...new Set(response.data.map(doctor => doctor.specialization))];
      setSpecialties(uniqueSpecialties);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors. Please try again later.');
      setLoading(false);
      console.error('Error fetching doctors:', err);
    }
  };
  
  useEffect(() => {
    // Filter doctors based on search term and speciality
    const results = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpeciality = specialityFilter === '' || doctor.specialization === specialityFilter;
      return matchesSearch && matchesSpeciality;
    });
    
    setFilteredDoctors(results);
  }, [searchTerm, specialityFilter, doctors]);
  
  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  return (
    <Container className="mt-4 mb-5">
      <h2>Find a Doctor</h2>
      <p>Browse our list of qualified doctors and book an appointment</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((speciality, index) => (
              <option key={index} value={speciality}>{speciality}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      
      {loading ? (
        <p>Loading doctors...</p>
      ) : filteredDoctors.length === 0 ? (
        <Alert variant="info">No doctors found matching your criteria.</Alert>
      ) : (
        <Row>
          {filteredDoctors.map(doctor => (
            <Col key={doctor.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Dr. {doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{doctor.specialization}</Card.Subtitle>
                  <Card.Text>
                    <strong>Email:</strong> {doctor.email}<br />
                    <strong>Phone:</strong> {doctor.phone}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    Book Appointment
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DoctorList;