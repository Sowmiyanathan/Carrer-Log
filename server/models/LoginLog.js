const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: 'Web Browser',
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'Success',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoginLog', loginLogSchema);