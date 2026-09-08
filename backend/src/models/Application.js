const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendationMessage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    notes: { type: String, default: '' },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: [
      {
        status: { type: String },
        updatedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);