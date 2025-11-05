import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="jumbotron text-center bg-light p-5 rounded">
            <h1>Welcome to Doctor Appointment System</h1>
            <p className="lead">
              Book appointments with qualified doctors easily and manage your health efficiently.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>For Patients</Card.Title>
              <Card.Text>
                Book appointments with doctors, manage your medical history, and receive quality healthcare.
              </Card.Text>
              <Link to="/register">
                <Button variant="outline-primary">Register as Patient</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>For Doctors</Card.Title>
              <Card.Text>
                Manage your appointments, patient records, and provide feedback to improve healthcare.
              </Card.Text>
              <Link to="/register">
                <Button variant="outline-success">Register as Doctor</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Easy Management</Card.Title>
              <Card.Text>
                Our system provides easy management of appointments, medical records, and doctor-patient communication.
              </Card.Text>
              <Link to="/login">
                <Button variant="outline-info">Login</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;