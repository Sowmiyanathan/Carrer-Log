const express = require('express');
const router = express.Router();
const {
  getApplications,
  getStats,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All application routes require login

router.get('/', getApplications);
router.get('/stats', getStats);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;