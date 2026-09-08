const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const Assessment = require('../models/Assessment');
const { normalizeSkill } = require('../utils/skillMatcher');

// @desc    Get comprehensive admin analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Key Metrics Cards
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const activeOpportunities = await Opportunity.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const selectedCandidates = await Application.countDocuments({ status: 'Selected' });

    // 2. Most requested industry skills (from all opportunities)
    const opportunities = await Opportunity.find({ status: 'active' }).select('requiredSkills');
    const requestedSkillsMap = {};
    for (const opp of opportunities) {
      for (const skill of opp.requiredSkills) {
        const clean = skill.trim();
        if (clean) {
          requestedSkillsMap[clean] = (requestedSkillsMap[clean] || 0) + 1;
        }
      }
    }
    const mostRequestedIndustrySkills = Object.entries(requestedSkillsMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 3. Top missing skills among students (calculated from applications missingSkills)
    const applications = await Application.find().select('missingSkills');
    const missingSkillsMap = {};
    for (const app of applications) {
      for (const skill of app.missingSkills || []) {
        const clean = skill.trim();
        if (clean) {
          missingSkillsMap[clean] = (missingSkillsMap[clean] || 0) + 1;
        }
      }
    }
    const topMissingSkills = Object.entries(missingSkillsMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 4. Placement readiness average across roles (from latest student assessments)
    const studentProfiles = await StudentProfile.find().select('roleReadiness');
    let feTotal = 0, feCount = 0;
    let daTotal = 0, daCount = 0;
    let beTotal = 0, beCount = 0;

    for (const sp of studentProfiles) {
      if (sp.roleReadiness) {
        if (sp.roleReadiness.frontend && typeof sp.roleReadiness.frontend.percentage === 'number') {
          feTotal += sp.roleReadiness.frontend.percentage;
          feCount++;
        }
        if (sp.roleReadiness.dataAnalyst && typeof sp.roleReadiness.dataAnalyst.percentage === 'number') {
          daTotal += sp.roleReadiness.dataAnalyst.percentage;
          daCount++;
        }
        if (sp.roleReadiness.backend && typeof sp.roleReadiness.backend.percentage === 'number') {
          beTotal += sp.roleReadiness.backend.percentage;
          beCount++;
        }
      }
    }

    const placementReadinessAverage = {
      frontend: feCount > 0 ? Math.round(feTotal / feCount) : 65,
      dataAnalyst: daCount > 0 ? Math.round(daTotal / daCount) : 58,
      backend: beCount > 0 ? Math.round(beTotal / beCount) : 62,
    };

    // 5. Verification queues count
    const pendingCertificates = await Certificate.countDocuments({ verificationStatus: 'pending' });
    const pendingProjects = await Project.countDocuments({ verificationStatus: 'pending' });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        activeOpportunities,
        totalApplications,
        selectedCandidates,
        pendingVerifications: pendingCertificates + pendingProjects,
      },
      mostRequestedIndustrySkills,
      topMissingSkills,
      placementReadinessAverage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending and verified items for College Admin verification
// @route   GET /api/admin/verifications
// @access  Private (Admin)
exports.getVerifications = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate('student', 'name email college')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    const projects = await Project.find()
      .populate('student', 'name email college')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      certificates,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or reject a certificate or project
// @route   PUT /api/admin/verifications/:type/:id
// @access  Private (Admin)
exports.updateVerificationStatus = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { status, notes } = req.body;

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be verified, rejected, or pending.',
      });
    }

    let updatedItem = null;
    const updateData = {
      verificationStatus: status,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      notes: notes || '',
    };

    if (type === 'certificate') {
      updatedItem = await Certificate.findByIdAndUpdate(id, updateData, { new: true })
        .populate('student', 'name email')
        .populate('verifiedBy', 'name email');
    } else if (type === 'project') {
      updatedItem = await Project.findByIdAndUpdate(id, updateData, { new: true })
        .populate('student', 'name email')
        .populate('verifiedBy', 'name email');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Type must be certificate or project.',
      });
    }

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `${type} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${type} marked as ${status}. Verified badge updated.`,
      item: updatedItem,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user directory (students, recruiters)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};