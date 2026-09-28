import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalApplications: 0,
    totalOffers: 0,
    totalLogins: 0,
    activeToday: 0,
  });
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'students' | 'applications'
  const [loading, setLoading] = useState(true);

  // Filters
  const [logSearch, setLogSearch] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [alert, setAlert] = useState({ type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  const fetchLogs = async () => {
    try {
      let url = '/admin/logs?';
      if (logSearch.trim()) url += `search=${encodeURIComponent(logSearch)}&`;
      if (logRoleFilter !== 'All') url += `role=${encodeURIComponent(logRoleFilter)}&`;
      const res = await api.get(url);
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load login logs', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const fetchCampusApplications = async () => {
    try {
      let url = '/admin/applications?';
      if (appStatusFilter !== 'All') url += `status=${encodeURIComponent(appStatusFilter)}&`;
      const res = await api.get(url);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchLogs(), fetchStudents(), fetchCampusApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 200);
    return () => clearTimeout(timer);
  }, [logSearch, logRoleFilter]);

  useEffect(() => {
    fetchCampusApplications();
  }, [appStatusFilter]);

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student account "${studentName}" and all their applications?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/students/${studentId}`);
      if (res.data.success) {
        showAlert('success', res.data.message);
        loadAllData();
      }
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all login audit logs?')) return;
    try {
      const res = await api.delete('/admin/logs');
      if (res.data.success) {
        showAlert('success', 'Login audit logs cleared.');
        fetchLogs();
        fetchStats();
      }
    } catch (err) {
      showAlert('danger', 'Failed to clear logs');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-4 fade-in">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-2 fw-semibold">
              <i className="bi bi-shield-lock-fill me-1"></i> Placement Administrator
            </span>
            <h2 className="fw-bold text-dark mb-0">Placement & Activity Command Center</h2>
          </div>
          <p className="text-muted small mb-0 mt-1">
            Monitor real-time student logins, oversee campus-wide placement applications, and track institutional hiring performance.
          </p>
        </div>
        <button onClick={loadAllData} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 shadow-sm">
          <i className="bi bi-arrow-clockwise"></i> Refresh Data
        </button>
      </div>

      {/* Alert Banner */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm`} role="alert">
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill'} fs-5`}></i>
          <div>{alert.message}</div>
          <button type="button" className="btn-close shadow-none" onClick={() => setAlert({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Top Placement & System Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg flex-grow-1">
          <div className="card p-3 border-0 shadow-sm bg-white stat-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">Registered Students</span>
              <i className="bi bi-people-fill fs-5 text-primary"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.totalStudents}</h3>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg flex-grow-1">
          <div className="card p-3 border-0 shadow-sm bg-white stat-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">Total Applications</span>
              <i className="bi bi-send-fill fs-5 text-info"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.totalApplications}</h3>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg flex-grow-1">
          <div className="card p-3 border-0 shadow-sm bg-white stat-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">Offers Secured</span>
              <i className="bi bi-award-fill fs-5 text-success"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.totalOffers}</h3>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg flex-grow-1">
          <div className="card p-3 border-0 shadow-sm bg-white stat-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">Active in Last 24h</span>
              <i className="bi bi-lightning-charge-fill fs-5 text-warning"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.activeToday}</h3>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg flex-grow-1">
          <div className="card p-3 border-0 shadow-sm bg-white stat-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">Total Logins Tracked</span>
              <i className="bi bi-journal-text fs-5 text-secondary"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.totalLogins}</h3>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 border-bottom pb-3 mb-4">
        <button
          onClick={() => setActiveTab('logs')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 ${
            activeTab === 'logs' ? 'btn-primary' : 'btn-light border text-secondary'
          }`}
        >
          <i className="bi bi-person-check-fill"></i> Live Login Monitor
          <span className="badge bg-white text-dark rounded-pill ms-1">{logs.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 ${
            activeTab === 'students' ? 'btn-primary' : 'btn-light border text-secondary'
          }`}
        >
          <i className="bi bi-mortarboard-fill"></i> Student Directory
          <span className="badge bg-white text-dark rounded-pill ms-1">{students.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 ${
            activeTab === 'applications' ? 'btn-primary' : 'btn-light border text-secondary'
          }`}
        >
          <i className="bi bi-briefcase-fill"></i> Campus Applications Feed
          <span className="badge bg-white text-dark rounded-pill ms-1">{applications.length}</span>
        </button>
      </div>

      {/* TAB 1: LIVE LOGIN MONITOR */}
      {activeTab === 'logs' && (
        <div>
          <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Search logs by student name, email, or IP..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                  />
                  {logSearch && (
                    <button className="btn btn-light border-start-0" onClick={() => setLogSearch('')}>
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-3 ms-auto d-flex justify-content-md-end gap-2">
                <select
                  className="form-select form-select-sm bg-light"
                  value={logRoleFilter}
                  onChange={(e) => setLogRoleFilter(e.target.value)}
                >
                  <option value="All">All User Roles</option>
                  <option value="student">Students Only</option>
                  <option value="admin">Admins Only</option>
                </select>
                <button
                  onClick={handleClearLogs}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 text-nowrap"
                  title="Clear login audit logs"
                >
                  <i className="bi bi-trash"></i> Clear Logs
                </button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">User Details</th>
                    <th scope="col">Role</th>
                    <th scope="col">Exact Login Timestamp</th>
                    <th scope="col">IP Address / Host</th>
                    <th scope="col" className="text-end pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="bi bi-journal-x fs-2 d-block mb-2"></i>
                        No login activity matches the search filter.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{log.name}</div>
                          <div className="small text-muted font-monospace">{log.email}</div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              log.role === 'admin'
                                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                : 'bg-primary-subtle text-primary border border-primary-subtle'
                            } px-2 py-1 rounded-pill`}
                          >
                            {log.role === 'admin' ? 'Placement Admin' : 'Student'}
                          </span>
                        </td>
                        <td>
                          <div className="small fw-semibold text-dark">
                            <i className="bi bi-clock me-1 text-muted"></i>
                            {formatDateTime(log.loginTime)}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border font-monospace small">
                            <i className="bi bi-laptop me-1"></i>
                            {log.ip}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                            <i className="bi bi-check-circle-fill me-1"></i> {log.status || 'Authenticated'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT PLACEMENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Student Name & Email</th>
                  <th scope="col">College / Dept</th>
                  <th scope="col">Batch</th>
                  <th scope="col">Applications Submitted</th>
                  <th scope="col">Offers Received</th>
                  <th scope="col">Last Login</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{st.name}</div>
                      <div className="small text-muted">{st.email}</div>
                    </td>
                    <td>
                      <span className="small text-secondary">{st.college}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">Class of {st.graduationYear}</span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border border-info-subtle px-2.5 py-1 rounded-pill fw-bold">
                        {st.totalApplications} applied
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${st.totalOffers > 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-light text-muted border'} px-2.5 py-1 rounded-pill fw-bold`}>
                        {st.totalOffers} offers
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted">{formatDateTime(st.lastLogin)}</span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        onClick={() => handleDeleteStudent(st._id, st.name)}
                        className="btn btn-sm btn-outline-danger"
                        title="Remove student account"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPUS-WIDE APPLICATIONS FEED */}
      {activeTab === 'applications' && (
        <div>
          <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
            <div className="d-flex gap-2">
              {['All', 'Applied', 'Interviewing', 'Offered', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setAppStatusFilter(status)}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    appStatusFilter === status ? 'btn-primary' : 'btn-light border text-secondary'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Applicant Student</th>
                    <th scope="col">Company & Role</th>
                    <th scope="col">Location & Type</th>
                    <th scope="col">Compensation</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-4">Date Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{app.user?.name || 'Unknown Student'}</div>
                        <div className="small text-muted">{app.user?.email}</div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{app.company}</div>
                        <div className="small text-secondary">{app.role}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border me-1 small">{app.jobType}</span>
                        <span className="small text-muted">{app.location}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark small">{app.salary}</span>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="text-end pe-4">
                        <span className="small text-muted">{new Date(app.appliedDate).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;