import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

const ViewFeedback = () => {
  const { doctorId } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/feedback/doctor/${doctorId}`);
        setFeedbackList(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [doctorId]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Patient Feedback</h3>
      {feedbackList.length === 0 ? (
        <Alert variant="info">No feedback available yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.patient?.name || 'Unknown'}</td>
                <td>{fb.rating}</td>
                <td>{fb.comments}</td>
                <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewFeedback;
