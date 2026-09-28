import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res && res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setSubmitting(true);

    try {
      const res = await login(demoEmail, demoPassword);
      if (res && res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Login failed');
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
                <i className="bi bi-briefcase-fill fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">Welcome to CareerLog</h3>
              <p className="text-muted small">Sign in to manage applications & placement records</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-octagon-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="name@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={submitting}
              >
                {submitting && <span className="spinner-border spinner-border-sm"></span>}
                Sign In
              </button>
            </form>

            {/* Quick Demo Login Buttons */}
            <div className="border-top pt-3 text-center">
              <span className="text-muted small fw-semibold d-block mb-2">
                ⚡ Review / Presentation 1-Click Login:
              </span>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('demo@careerlog.com', 'Demo@123')}
                  className="btn btn-outline-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  <i className="bi bi-person-workspace"></i> Login as Demo Student (Aditya Narayanan)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@careerlog.com', 'Admin@123')}
                  className="btn btn-outline-danger btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  <i className="bi bi-shield-check"></i> Login as Placement Admin (Dr. S. Ramanathan)
                </button>
              </div>
            </div>

            <div className="text-center mt-4 pt-2 border-top">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="text-primary fw-semibold small text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;