const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Get all opportunities with search & filters
// @route   GET /api/opportunities
// @access  Public / Authenticated
exports.getOpportunities = async (req, res, next) => {
  try {
    const { search, type, location, skill, status } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active'; // default only active listings
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (skill) {
      query.requiredSkills = { $regex: skill, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const opportunities = await Opportunity.find(query)
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public / Authenticated
exports.getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('recruiter', 'name email company');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    res.status(200).json({
      success: true,
      opportunity,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Calculate smart skill match for an opportunity vs current student
// @route   GET /api/opportunities/:id/match
// @access  Private (Student)
exports.getOpportunityMatch = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    const studentSkills = studentProfile ? studentProfile.skills : [];

    const matchResult = calculateSkillMatch(opportunity.requiredSkills, studentSkills);

    res.status(200).json({
      success: true,
      opportunityId: opportunity._id,
      title: opportunity.title,
      company: opportunity.company,
      requiredSkills: opportunity.requiredSkills,
      studentSkills,
      matchPercentage: matchResult.matchPercentage,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      recommendationMessage: matchResult.recommendationMessage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new opportunity (Recruiter only)
// @route   POST /api/opportunities
// @access  Private (Recruiter/Admin)
exports.createOpportunity = async (req, res, next) => {
  try {
    const {
      title,
      company,
      type,
      location,
      stipendOrSalary,
      duration,
      deadline,
      description,
      requiredSkills,
      eligibility,
    } = req.body;

    if (!title || !company || !location || !stipendOrSalary || !deadline || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, company, location, stipendOrSalary, deadline, description).',
      });
    }

    const parsedSkills = Array.isArray(requiredSkills)
      ? requiredSkills.map((s) => String(s).trim()).filter(Boolean)
      : String(requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean);

    const opportunity = await Opportunity.create({
      recruiter: req.user._id,
      title: title.trim(),
      company: company.trim(),
      type: type || 'Internship',
      location: location.trim(),
      stipendOrSalary: stipendOrSalary.trim(),
      duration: duration ? duration.trim() : 'Full Time',
      deadline: new Date(deadline),
      description: description.trim(),
      requiredSkills: parsedSkills,
      eligibility: eligibility ? eligibility.trim() : 'Open to all students',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully.',
      opportunity,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update opportunity (Recruiter/Admin)
// @route   PUT /api/opportunities/:id
// @access  Private (Recruiter/Admin)
exports.updateOpportunity = async (req, res, next) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    // Check ownership if recruiter
    if (req.user.role === 'recruiter' && opportunity.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit opportunities you created.',
      });
    }

    if (req.body.requiredSkills && !Array.isArray(req.body.requiredSkills)) {
      req.body.requiredSkills = String(req.body.requiredSkills).split(',').map((s) => s.trim()).filter(Boolean);
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully.',
      opportunity,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Recruiter/Admin)
exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    if (req.user.role === 'recruiter' && opportunity.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete opportunities you created.',
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recruiter's posted opportunities
// @route   GET /api/opportunities/recruiter/my-listings
// @access  Private (Recruiter)
exports.getMyListings = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (err) {
    next(err);
  }
};