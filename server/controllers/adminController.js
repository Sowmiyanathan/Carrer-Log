const User = require('../models/User');
const Application = require('../models/Application');
const LoginLog = require('../models/LoginLog');

// @desc    Get system-wide overview stats for Admin Dashboard
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();
    const totalOffers = await Application.countDocuments({ status: 'Offered' });
    const totalLogins = await LoginLog.countDocuments();

    // Logins in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await LoginLog.countDocuments({ loginTime: { $gte: oneDayAgo } });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalApplications,
        totalOffers,
        totalLogins,
        activeToday,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get real-time login activity logs (Who logged into the website)
// @route   GET /api/admin/logs
exports.getLoginLogs = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { ip: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const logs = await LoginLog.find(query)
      .sort({ loginTime: -1 })
      .limit(100);

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all registered students with placement metrics
// @route   GET /api/admin/students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate each student's applications count and offers count
    const studentData = await Promise.all(
      students.map(async (st) => {
        const appsCount = await Application.countDocuments({ user: st._id });
        const offersCount = await Application.countDocuments({ user: st._id, status: 'Offered' });
        return {
          ...st.toObject(),
          totalApplications: appsCount,
          totalOffers: offersCount,
        };
      })
    );

    res.json({
      success: true,
      count: studentData.length,
      data: studentData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all campus-wide applications with applicant details
// @route   GET /api/admin/applications
exports.getAllCampusApplications = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('user', 'name email college graduationYear')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete student account and their applications
// @route   DELETE /api/admin/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    // Cascade delete their applications and logs
    await Application.deleteMany({ user: student._id });
    await LoginLog.deleteMany({ user: student._id });
    await student.deleteOne();

    res.json({
      success: true,
      message: `Student account ${student.name} and associated records deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Clear login logs history
// @route   DELETE /api/admin/logs
exports.clearLoginLogs = async (req, res) => {
  try {
    await LoginLog.deleteMany({});
    res.json({ success: true, message: 'Login logs audit trail cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};