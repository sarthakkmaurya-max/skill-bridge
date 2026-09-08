const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  getOpportunityMatch,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getMyListings,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getOpportunities);
router.get('/recruiter/my-listings', protect, authorizeRoles('recruiter', 'admin'), getMyListings);
router.get('/:id', getOpportunityById);
router.get('/:id/match', protect, authorizeRoles('student', 'admin'), getOpportunityMatch);

router.post('/', protect, authorizeRoles('recruiter', 'admin'), createOpportunity);
router.put('/:id', protect, authorizeRoles('recruiter', 'admin'), updateOpportunity);
router.delete('/:id', protect, authorizeRoles('recruiter', 'admin'), deleteOpportunity);

module.exports = router;