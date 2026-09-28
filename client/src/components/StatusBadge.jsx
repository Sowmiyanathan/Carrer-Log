import React from 'react';

const StatusBadge = ({ status }) => {
  const norm = (status || 'Applied').toLowerCase();
  const classMap = {
    applied: 'badge-applied',
    interviewing: 'badge-interviewing',
    offered: 'badge-offered',
    rejected: 'badge-rejected',
  };

  const iconMap = {
    applied: 'bi-send-fill',
    interviewing: 'bi-camera-video-fill',
    offered: 'bi-award-fill',
    rejected: 'bi-x-circle-fill',
  };

  return (
    <span className={`badge px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${classMap[norm] || 'bg-light text-dark'}`} style={{ fontSize: '0.8rem' }}>
      <i className={`bi ${iconMap[norm] || 'bi-info-circle'}`}></i>
      {status}
    </span>
  );
};

export default StatusBadge;