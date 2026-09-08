const Certificate = require('../models/Certificate');
const Project = require('../models/Project');

// @desc    Get certificates for current student
// @route   GET /api/portfolio/certificates
// @access  Private (Student/Admin)
exports.getCertificates = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || req.user._id;
    const certificates = await Certificate.find({ student: studentId })
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add certificate
// @route   POST /api/portfolio/certificates
// @access  Private (Student)
exports.addCertificate = async (req, res, next) => {
  try {
    const { title, issuer, issueDate, credentialUrl, notes } = req.body;

    if (!title || !issuer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide certificate title and issuer.',
      });
    }

    const certificate = await Certificate.create({
      student: req.user._id,
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      credentialUrl: credentialUrl ? credentialUrl.trim() : '',
      notes: notes || '',
      verificationStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Certificate added and submitted for College Admin verification!',
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/portfolio/certificates/:id
// @access  Private (Student/Admin)
exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    if (req.user.role === 'student' && certificate.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Certificate deleted.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get projects for student
// @route   GET /api/portfolio/projects
// @access  Private (Student/Admin)
exports.getProjects = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || req.user._id;
    const projects = await Project.find({ student: studentId })
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add project
// @route   POST /api/portfolio/projects
// @access  Private (Student)
exports.addProject = async (req, res, next) => {
  try {
    const { title, description, technologies, repoUrl, liveUrl, notes } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title and description.',
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies.map((t) => String(t).trim()).filter(Boolean)
      : String(technologies || '').split(',').map((t) => t.trim()).filter(Boolean);

    const project = await Project.create({
      student: req.user._id,
      title: title.trim(),
      description: description.trim(),
      technologies: techArray,
      repoUrl: repoUrl ? repoUrl.trim() : '',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      notes: notes || '',
      verificationStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Project added and submitted for College Admin verification!',
      project,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/portfolio/projects/:id
// @access  Private (Student/Admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (req.user.role === 'student' && project.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload attachment (resume or certificate document)
// @route   POST /api/portfolio/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: req.file.originalname,
    });
  } catch (err) {
    next(err);
  }
};