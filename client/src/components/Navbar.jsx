import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top py-2.5">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to={isAdmin ? '/admin' : '/'}>
          <span className="brand-badge d-flex align-items-center justify-content-center">
            <i className="bi bi-briefcase-fill fs-5"></i>
          </span>
          <span className="fw-bold text-dark fs-5 tracking-tight">
            Career<span className="text-primary">Log</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="d-flex align-items-center gap-2 ms-3 me-auto">
          {isAuthenticated && (
            <>
              {isAdmin ? (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1.5 rounded-2 fw-semibold small ${
                        isActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
                      }`
                    }
                  >
                    <i className="bi bi-shield-check me-1"></i> Admin Portal
                  </NavLink>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `nav-link px-3 py-1.5 rounded-2 fw-semibold small ${
                        isActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
                      }`
                    }
                  >
                    <i className="bi bi-person-lines-fill me-1"></i> Student View
                  </NavLink>
                </>
              ) : (
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-link px-3 py-1.5 rounded-2 fw-semibold small ${
                      isActive ? 'bg-primary text-white' : 'text-secondary'
                    }`
                  }
                >
                  <i className="bi bi-columns-gap me-1"></i> My Applications
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* User Profile & Auth Button */}
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-sm-block text-end">
                <div className="fw-bold text-dark small">{user?.name}</div>
                <div className="d-flex align-items-center justify-content-end gap-1.5">
                  <span
                    className={`badge ${
                      isAdmin ? 'bg-danger-subtle text-danger border-danger-subtle' : 'bg-primary-subtle text-primary border-primary-subtle'
                    } border px-2 py-0.5 rounded-pill`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {isAdmin ? 'Placement Admin' : 'Student'}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {user?.college}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1.5"
                title="Logout"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm px-3">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;