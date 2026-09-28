const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job position/role is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Full-Time', 'Part-Time', 'Contract'],
      default: 'Full-Time',
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    salary: {
      type: String,
      default: 'Not Specified',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    jobUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);