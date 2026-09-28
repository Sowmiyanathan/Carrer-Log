const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getLoginLogs,
  getAllStudents,
  getAllCampusApplications,
  deleteStudent,
  clearLoginLogs,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/logs', getLoginLogs);
router.delete('/logs', clearLoginLogs);
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);
router.get('/applications', getAllCampusApplications);

module.exports = router;