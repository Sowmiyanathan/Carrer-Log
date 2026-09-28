import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: 'School of Engineering & Technology',
    graduationYear: 2026,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await register(formData);
      if (res && res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 p-4 p-sm-5" style={{ borderRadius: '16px' }}>
            <div className="text-center mb-4">
              <div className="brand-badge d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-person-plus-fill fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">Create Student Profile</h3>
              <p className="text-muted small">Register to track your campus job applications</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-octagon-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-light"
                  placeholder="e.g. Aditya Narayanan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Password (Min 6 chars)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-light"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-2 mb-4">
                <div className="col-8">
                  <label className="form-label small fw-semibold text-secondary">College / University</label>
                  <input
                    type="text"
                    name="college"
                    className="form-control bg-light"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold text-secondary">Grad Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    className="form-control bg-light"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={submitting}
              >
                {submitting && <span className="spinner-border spinner-border-sm"></span>}
                Create Account
              </button>
            </form>

            <div className="text-center mt-3 pt-2 border-top">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;