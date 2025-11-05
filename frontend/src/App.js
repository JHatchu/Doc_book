import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NavBar from './components/NavBar';
import Feedback from './pages/FeedBack';
import ViewFeedback from './pages/ViewFeedback';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/book-appointment/:doctorId?" element={<BookAppointment />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/feedback/:appointmentId?" element={<Feedback />} />
          <Route path="/view-feedback/:doctorId?" element={<ViewFeedback />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;