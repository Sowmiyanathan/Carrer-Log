const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careerlog_secure_jwt_token_key_2026', {
    expiresIn: '7d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, college, graduationYear, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'admin' : 'student',
      college: college || 'School of Engineering & Technology',
      graduationYear: graduationYear || 2026,
      lastLogin: new Date(),
      loginCount: 1,
    });

    // Record initial registration login log
    await LoginLog.create({
      user: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ip: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Web Browser',
      status: 'Success (Registered)',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        graduationYear: user.graduationYear,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user && (await user.matchPassword(password))) {
      // Update login tracking metadata on user
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();

      // Record in LoginLog collection for Admin Monitoring
      await LoginLog.create({
        user: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ip: req.ip || req.connection?.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Web Browser',
        status: 'Success',
      });

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          graduationYear: user.graduationYear,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
        },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};