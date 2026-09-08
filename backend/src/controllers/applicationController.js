const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Apply to an opportunity
// @route   POST /api/applications
// @access  Private (Student)
exports.applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, notes } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'opportunityId is required.',
      });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    if (opportunity.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer accepting applications.',
      });
    }

    // Check if student already applied
    const existing = await Application.findOne({
      opportunity: opportunityId,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this opportunity.',
      });
    }

    // Retrieve student profile to calculate smart match
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    const studentSkills = studentProfile ? studentProfile.skills : [];

    const match = calculateSkillMatch(opportunity.requiredSkills, studentSkills);

    const application = await Application.create({
      opportunity: opportunityId,
      student: req.user._id,
      studentProfile: studentProfile ? studentProfile._id : null,
      matchScore: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      recommendationMessage: match.recommendationMessage,
      status: 'Applied',
      notes: notes || '',
      statusHistory: [
        {
          status: 'Applied',
          updatedAt: new Date(),
          comment: 'Application submitted by student.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'opportunity',
        select: 'title company type location stipendOrSalary duration deadline status',
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applicants for an opportunity (Recruiter/Admin) sorted by matchScore descending
// @route   GET /api/applications/opportunity/:opportunityId
// @access  Private (Recruiter/Admin)
exports.getOpportunityApplicants = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const { status, sortBy } = req.query;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    if (req.user.role === 'recruiter' && opportunity.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view applicants for your own opportunities.',
      });
    }

    const filter = { opportunity: opportunityId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    let sortOption = { matchScore: -1, appliedAt: -1 }; // Default: highest match score first
    if (sortBy === 'appliedAt') {
      sortOption = { appliedAt: -1 };
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email college')
      .populate('studentProfile')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (Recruiter/Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('opportunity');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // If recruiter, check that recruiter owns the opportunity
    if (req.user.role === 'recruiter') {
      const opp = application.opportunity;
      if (opp && opp.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update candidates for your own job listings.',
        });
      }
    }

    application.status = status;
    application.statusHistory.push({
      status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
      comment: comment || `Status updated to ${status}`,
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}.`,
      application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications (Admin / Recruiter overview)
// @route   GET /api/applications
// @access  Private (Admin / Recruiter)
exports.getAllApplications = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'recruiter') {
      const recruiterOpps = await Opportunity.find({ recruiter: req.user._id }).select('_id');
      const oppIds = recruiterOpps.map((o) => o._id);
      filter = { opportunity: { $in: oppIds } };
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email college')
      .populate('opportunity', 'title company type')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};