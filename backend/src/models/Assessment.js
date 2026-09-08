const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        questionId: { type: Number, required: true },
        questionText: { type: String },
        selectedOption: { type: String },
        isCorrect: { type: Boolean },
        category: { type: String },
        competency: { type: String },
      },
    ],
    totalScore: { type: Number, default: 0 },
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
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);