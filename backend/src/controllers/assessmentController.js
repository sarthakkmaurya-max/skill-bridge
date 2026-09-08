const Assessment = require('../models/Assessment');
const StudentProfile = require('../models/StudentProfile');
const { ASSESSMENT_QUESTIONS, evaluateAssessment } = require('../utils/assessmentEvaluator');

// @desc    Get the 10 assessment questions (without answers for security)
// @route   GET /api/assessments/questions
// @access  Private (Student)
exports.getQuestions = async (req, res, next) => {
  try {
    const questionsForClient = ASSESSMENT_QUESTIONS.map((q) => ({
      id: q.id,
      category: q.category,
      competency: q.competency,
      roleAffinity: q.roleAffinity,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      count: questionsForClient.length,
      questions: questionsForClient,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit assessment answers, calculate role readiness and update student profile
// @route   POST /api/assessments/submit
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of answers with questionId and selectedOption.',
      });
    }

    // Evaluate answers
    const evaluation = evaluateAssessment(answers);

    // Persist assessment record
    const assessment = await Assessment.create({
      student: req.user._id,
      answers: evaluation.gradedAnswers,
      totalScore: evaluation.totalCorrect,
      roleReadiness: evaluation.roleReadiness,
      completedAt: new Date(),
    });

    // Update student profile cache with latest role readiness
    await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { roleReadiness: evaluation.roleReadiness } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Assessment evaluated and recorded successfully.',
      assessmentId: assessment._id,
      overallScore: `${evaluation.totalCorrect} / ${evaluation.totalQuestions} (${evaluation.overallScorePercentage}%)`,
      roleReadiness: evaluation.roleReadiness,
      gradedAnswers: evaluation.gradedAnswers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's latest assessment result
// @route   GET /api/assessments/my-results
// @access  Private (Student)
exports.getMyResults = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ student: req.user._id }).sort({ completedAt: -1 });

    if (!assessment) {
      return res.status(200).json({
        success: true,
        hasTakenAssessment: false,
        message: 'No assessment taken yet.',
      });
    }

    res.status(200).json({
      success: true,
      hasTakenAssessment: true,
      assessment,
    });
  } catch (err) {
    next(err);
  }
};