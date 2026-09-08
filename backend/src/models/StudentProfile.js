const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    college: { type: String, default: '' },
    branch: { type: String, default: '' },
    graduationYear: { type: Number, default: new Date().getFullYear() },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    bio: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    roleReadiness: {
      frontend: {
        percentage: { type: Number, default: 0 },
        strengths: [{ type: String }],
        gaps: [{ type: String }],
        recommendation: { type: String, default: '' },
      },
      dataAnalyst: {
        percentage: { type: Number, default: 0 },
        strengths: [{ type: String }],
        gaps: [{ type: String }],
        recommendation: { type: String, default: '' },
      },
      backend: {
        percentage: { type: Number, default: 0 },
        strengths: [{ type: String }],
        gaps: [{ type: String }],
        recommendation: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);