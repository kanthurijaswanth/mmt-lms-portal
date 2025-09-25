import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import StudentDashboard from './pages/Student/Dashboard.jsx';
import StudentExperiment from './pages/Student/ExperimentDetail.jsx';
import FacultyDashboard from './pages/Faculty/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login/>} />
          <Route path="admin" element={<AdminDashboard/>} />
          <Route path="student" element={<StudentDashboard/>} />
          <Route path="student/experiment/:id" element={<StudentExperiment/>} />
          <Route path="faculty" element={<FacultyDashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
