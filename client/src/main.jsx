import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import StudentDashboard from './pages/Student/Dashboard.jsx';
import StudentExperiment from './pages/Student/ExperimentDetail.jsx';
import FacultyDashboard from './pages/Faculty/Dashboard.jsx';
import RoleSelect from './pages/RoleSelect.jsx';
import RequireRole from './RequireRole.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* land on role selection */}
          <Route index element={<Navigate to="/select-role" replace />} />

          {/* role selection page with 3 cards */}
          <Route path="select-role" element={<RoleSelect />} />

          {/* role-specific login routes */}
          <Route path="login/:role" element={<Login />} />

          {/* Guarded dashboards */}
          <Route
            path="admin"
            element={<RequireRole role="admin"><AdminDashboard /></RequireRole>}
          />
          <Route
            path="student"
            element={<RequireRole role="student"><StudentDashboard /></RequireRole>}
          />
          <Route
            path="student/experiment/:id"
            element={<RequireRole role="student"><StudentExperiment /></RequireRole>}
          />
          <Route
            path="faculty"
            element={<RequireRole role="faculty"><FacultyDashboard /></RequireRole>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
