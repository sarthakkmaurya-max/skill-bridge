const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getVerifications,
  updateVerificationStatus,
  getUsers,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/analytics', getAnalytics);
router.get('/verifications', getVerifications);
router.put('/verifications/:type/:id', updateVerificationStatus);
router.get('/users', getUsers);

module.exports = router;