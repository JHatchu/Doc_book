import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Feedback = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState({
    appointmentId: appointmentId || '',

    patientId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : '',
    rating: '',
    comments: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Optional: fetch appointment details to get doctorId automatically
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/appointments/${appointmentId}`);
        if (response.data?.doctor?.id) {
          setFeedbackData((prev) => ({
            ...prev,
            doctorId: response.data.doctor.id
          }));
        }
      } catch (err) {
        console.error('Error fetching appointment details:', err);
      }
    };
    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // ✅ Log data before sending
    console.log('Sending feedbackData:', feedbackData);

    // Validate fields
    if (
      !feedbackData.appointmentId ||
   
      !feedbackData.patientId ||
      !feedbackData.rating
    ) {
      setError('Please fill all required fields before submitting.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/feedback/add', feedbackData);
      setMessage('Feedback submitted successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect to home after 2s
    } catch (err) {
      console.error('Error submitting feedback:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Leave Feedback</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="rating" className="mb-3">
          <Form.Label>Rating (1 to 5)</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            value={feedbackData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </Form.Group>

        <Form.Group controlId="comments" className="mb-3">
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="comments"
            value={feedbackData.comments}
            onChange={handleChange}
            placeholder="Write your feedback here..."
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Submit Feedback
        </Button>
      </Form>
    </Container>
  );
};

export default Feedback;
