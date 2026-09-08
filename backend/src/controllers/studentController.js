const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const Assessment = require('../models/Assessment');

// @desc    Get current student profile with projects and certificates
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    
    if (!profile) {
      // Auto-create default profile if missing
      profile = await StudentProfile.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        college: req.user.college || '',
        skills: ['JavaScript', 'HTML/CSS', 'Git'],
        interests: ['Software Development'],
      });
    }

    const certificates = await Certificate.find({ student: req.user._id }).sort({ createdAt: -1 });
    const projects = await Project.find({ student: req.user._id }).sort({ createdAt: -1 });
    const latestAssessment = await Assessment.findOne({ student: req.user._id }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      profile,
      certificates,
      projects,
      latestAssessment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      branch,
      graduationYear,
      skills,
      interests,
      bio,
      resumeUrl,
    } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user._id });
    }

    if (name) {
      profile.name = name.trim();
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
    }
    if (college !== undefined) profile.college = college.trim();
    if (branch !== undefined) profile.branch = branch.trim();
    if (graduationYear !== undefined) profile.graduationYear = Number(graduationYear);
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills)
        ? skills.map((s) => String(s).trim()).filter(Boolean)
        : String(skills).split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (interests !== undefined) {
      profile.interests = Array.isArray(interests)
        ? interests.map((i) => String(i).trim()).filter(Boolean)
        : String(interests).split(',').map((i) => i.trim()).filter(Boolean);
    }
    if (bio !== undefined) profile.bio = bio.trim();
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl.trim();

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile,
    });
  } catch (err) {
    next(err);
  }
};