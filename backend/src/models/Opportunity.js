const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Internship', 'Job'],
      required: true,
      default: 'Internship',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    stipendOrSalary: {
      type: String,
      required: [true, 'Stipend/Salary information is required'],
      trim: true,
    },
    duration: {
      type: String,
      default: 'Full Time',
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: [{
      type: String,
      trim: true,
    }],
    eligibility: {
      type: String,
      default: 'Open to all graduates and final year students',
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);