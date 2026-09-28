import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ApplicationModal = ({ isOpen, onClose, editingItem, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobType: 'Full-Time',
    location: '',
    salary: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    jobUrl: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        company: editingItem.company || '',
        role: editingItem.role || '',
        jobType: editingItem.jobType || 'Full-Time',
        location: editingItem.location || '',
        salary: editingItem.salary || '',
        status: editingItem.status || 'Applied',
        appliedDate: editingItem.appliedDate
          ? new Date(editingItem.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        jobUrl: editingItem.jobUrl || '',
        notes: editingItem.notes || '',
      });
    } else {
      setFormData({
        company: '',
        role: '',
        jobType: 'Full-Time',
        location: '',
        salary: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        jobUrl: '',
        notes: '',
      });
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Please provide Company Name and Job Role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingItem) {
        const res = await api.put(`/applications/${editingItem._id}`, formData);
        if (res.data.success) {
          onSuccess('Application updated successfully');
          onClose();
        }
      } else {
        const res = await api.post('/applications', formData);
        if (res.data.success) {
          onSuccess('New application added to tracker');
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom px-4 py-3 bg-light" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <h5 className="modal-title fw-bold text-dark mb-0">
              {editingItem ? 'Edit Job Application' : 'Add New Application'}
            </h5>
            <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={loading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-octagon-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Google, Microsoft, Zoho"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Job Title / Role *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Software Engineer, React Developer Intern"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Job Type</label>
                  <select
                    className="form-select"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Location / Work Mode</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Bangalore (Hybrid), Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Salary / CTC / Stipend</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ₹50,000/mo or 12 LPA"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Application Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Date Applied</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Job Posting Link (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary">Interview Notes & Round Details</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add notes on technical rounds, coding questions asked, HR contacts, or next steps..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-top px-4 py-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button type="button" className="btn btn-light border px-4" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                {editingItem ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;