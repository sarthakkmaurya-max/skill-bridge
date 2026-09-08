const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitAssessment,
  getMyResults,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/questions', getQuestions);
router.post('/submit', authorizeRoles('student', 'admin'), submitAssessment);
router.get('/my-results', getMyResults);

module.exports = router;