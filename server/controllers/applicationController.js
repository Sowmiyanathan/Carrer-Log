const Application = require('../models/Application');

// @desc    Get all applications for logged-in student (with search & status filter)
// @route   GET /api/applications
exports.getApplications = async (req, res) => {
  try {
    const { search, status, jobType } = req.query;
    let query = { user: req.user._id };

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

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    const applications = await Application.find(query).sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get summary statistics for dashboard counters
// @route   GET /api/applications/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Application.countDocuments({ user: userId });
    const applied = await Application.countDocuments({ user: userId, status: 'Applied' });
    const interviewing = await Application.countDocuments({ user: userId, status: 'Interviewing' });
    const offered = await Application.countDocuments({ user: userId, status: 'Offered' });
    const rejected = await Application.countDocuments({ user: userId, status: 'Rejected' });

    res.json({
      success: true,
      data: { total, applied, interviewing, offered, rejected },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
exports.getApplicationById = async (req, res) => {
  try {
    const item = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new job application (CREATE)
// @route   POST /api/applications
exports.createApplication = async (req, res) => {
  try {
    const { company, role, jobType, location, salary, status, appliedDate, jobUrl, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Please provide Company Name and Job Role' });
    }

    const application = await Application.create({
      user: req.user._id,
      company: company.trim(),
      role: role.trim(),
      jobType: jobType || 'Full-Time',
      location: location || 'Remote',
      salary: salary || 'Not Specified',
      status: status || 'Applied',
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      jobUrl: jobUrl || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Job application added to tracker',
      data: application,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update application (UPDATE)
// @route   PUT /api/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    let item = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    const fields = ['company', 'role', 'jobType', 'location', 'salary', 'status', 'appliedDate', 'jobUrl', 'notes'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        item[f] = req.body[f];
      }
    });

    await item.save();

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: item,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete application (DELETE)
// @route   DELETE /api/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const item = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Application removed from tracker',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};