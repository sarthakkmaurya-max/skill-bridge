const express = require('express');
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  getOpportunityApplicants,
  updateApplicationStatus,
  getAllApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorizeRoles('student', 'admin'), applyToOpportunity);
router.get('/my-applications', authorizeRoles('student', 'admin'), getMyApplications);
router.get('/opportunity/:opportunityId', authorizeRoles('recruiter', 'admin'), getOpportunityApplicants);
router.put('/:id/status', authorizeRoles('recruiter', 'admin'), updateApplicationStatus);
router.get('/', authorizeRoles('recruiter', 'admin'), getAllApplications);

module.exports = router;