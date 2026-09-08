const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', authorizeRoles('student', 'admin'), updateProfile);

module.exports = router;