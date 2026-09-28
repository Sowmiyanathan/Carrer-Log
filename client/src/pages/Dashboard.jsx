import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import StatCards from '../components/StatCards';
import ApplicationModal from '../components/ApplicationModal';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchStats = async () => {
    try {
      const res = await api.get('/applications/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = '/applications?';
      if (search.trim()) url += `search=${encodeURIComponent(search)}&`;
      if (statusFilter && statusFilter !== 'All') url += `status=${encodeURIComponent(statusFilter)}&`;
      if (jobTypeFilter && jobTypeFilter !== 'All') url += `jobType=${encodeURIComponent(jobTypeFilter)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter, jobTypeFilter]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Are you sure you want to remove your application for "${company}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/applications/${id}`);
      if (res.data.success) {
        showAlert('success', 'Application removed from tracker');
        fetchApplications();
        fetchStats();
      }
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to delete application');
    }
  };

  const handleModalSuccess = (msg) => {
    showAlert('success', msg);
    fetchApplications();
    fetchStats();
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-4 fade-in">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Internship & Placement Tracker</h2>
          <p className="text-muted small mb-0">
            Organize job applications, track interview rounds, and monitor campus placement progress.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-lg"></i> Add Application
        </button>
      </div>

      {/* Alert */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm`} role="alert">
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill'} fs-5`}></i>
          <div>{alert.message}</div>
          <button type="button" className="btn-close shadow-none" onClick={() => setAlert({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <StatCards
        stats={stats}
        activeFilter={statusFilter}
        onSelectFilter={(f) => setStatusFilter(f)}
      />

      {/* Filters Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Keyword Search */}
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Search by company name, role, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-light border-start-0" onClick={() => setSearch('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="col-12 col-md-6 col-lg-3 ms-auto">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-briefcase text-muted"></i>
              </span>
              <select
                className="form-select bg-light"
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
              >
                <option value="All">All Job Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          {['All', 'Applied', 'Interviewing', 'Offered', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm rounded-pill px-3 fw-medium ${
                statusFilter === status ? 'btn-primary' : 'btn-light border text-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2 small">Loading job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-sm">
          <div className="text-muted mb-3">
            <i className="bi bi-briefcase fs-1"></i>
          </div>
          <h5 className="fw-bold">No Applications Found</h5>
          <p className="text-muted small">No applications match your search or selected filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setJobTypeFilter('All');
            }}
            className="btn btn-outline-primary btn-sm mx-auto"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Company & Position</th>
                  <th scope="col">Type & Location</th>
                  <th scope="col">Compensation</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Applied</th>
                  <th scope="col">Notes</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    {/* Company & Role */}
                    <td className="ps-4">
                      <div className="fw-bold text-dark fs-6">{app.company}</div>
                      <div className="text-secondary small fw-medium">{app.role}</div>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="small text-primary text-decoration-none"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i> View Job Post
                        </a>
                      )}
                    </td>

                    {/* Type & Location */}
                    <td>
                      <div>
                        <span className="badge bg-light text-dark border me-1 small">
                          {app.jobType}
                        </span>
                      </div>
                      <div className="text-muted small mt-1">
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {app.location}
                      </div>
                    </td>

                    {/* Compensation */}
                    <td>
                      <span className="fw-semibold text-dark small">{app.salary}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Applied Date */}
                    <td>
                      <div className="small text-dark fw-medium">{formatDate(app.appliedDate)}</div>
                    </td>

                    {/* Notes */}
                    <td style={{ maxWidth: '240px' }}>
                      {app.notes ? (
                        <p className="small text-muted mb-0 text-truncate" title={app.notes}>
                          {app.notes}
                        </p>
                      ) : (
                        <span className="small text-muted">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="btn btn-outline-secondary"
                          title="Edit application details"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(app._id, app.company)}
                          className="btn btn-outline-danger"
                          title="Delete application"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Dashboard;