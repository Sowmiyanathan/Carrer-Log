import React from 'react';

const StatCards = ({ stats, activeFilter, onSelectFilter }) => {
  const items = [
    { label: 'Total Applications', count: stats.total || 0, filter: 'All', icon: 'bi-folder2-open', color: 'text-primary' },
    { label: 'Under Review', count: stats.applied || 0, filter: 'Applied', icon: 'bi-hourglass-split', color: 'text-info' },
    { label: 'Interviewing', count: stats.interviewing || 0, filter: 'Interviewing', icon: 'bi-calendar-event', color: 'text-warning' },
    { label: 'Offers Received', count: stats.offered || 0, filter: 'Offered', icon: 'bi-check-circle-fill', color: 'text-success' },
    { label: 'Rejected', count: stats.rejected || 0, filter: 'Rejected', icon: 'bi-slash-circle', color: 'text-danger' },
  ];

  return (
    <div className="row g-3 mb-4">
      {items.map((it) => (
        <div key={it.filter} className="col-6 col-md-4 col-lg flex-grow-1">
          <div
            onClick={() => onSelectFilter(it.filter)}
            className={`card p-3 stat-card cursor-pointer border-0 shadow-sm ${
              activeFilter === it.filter ? 'ring-2 border-primary bg-primary-subtle' : 'bg-white'
            }`}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-muted fw-semibold">{it.label}</span>
              <i className={`bi ${it.icon} fs-5 ${it.color}`}></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{it.count}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;