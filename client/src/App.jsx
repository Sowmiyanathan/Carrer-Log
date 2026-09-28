import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Student Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Command Center (Admin Only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-white border-top py-3.5 mt-auto">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-muted small">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-dark">CareerLog</span>
            <span>•</span>
            <span>MERN Full-Stack Internship & Placement Tracker with Admin Monitoring</span>
          </div>
          <div>Built with React, Express, Node.js & MongoDB</div>
        </div>
      </footer>
    </div>
  );
}

export default App;