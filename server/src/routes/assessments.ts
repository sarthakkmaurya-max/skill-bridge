import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { 
  ApiResponse, 
  AssessmentResult, 
  ASSESSMENT_QUESTIONS, 
  calculateRoleReadiness 
} from '@skillbridge/shared';

export const assessmentsRouter = Router();

// In-memory store for development/sandbox mode to persist submitted assessments without Supabase
const sandboxAssessmentStore = new Map<string, AssessmentResult>();

/**
 * GET /api/assessments/latest
 * Returns the authenticated student's latest assessment and role readiness
 */
assessmentsRouter.get('/latest', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!isSupabaseConfigured) {
      // In sandbox mode, check if the student recently submitted an assessment
      const submitted = sandboxAssessmentStore.get(studentId) || sandboxAssessmentStore.get('default');
      if (submitted) {
        res.json({
          success: true,
          message: 'Latest assessment retrieved from sandbox store',
          data: submitted,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Default baseline sample only if no assessment has been submitted yet
      const sampleAnswers: Record<number, number> = {
        1: 4, // HTML/CSS
        2: 4, // JavaScript
        3: 4, // React
        4: 3, // Git
        5: 3, // SQL
        6: 2, // Python
        7: 4, // Communication
        8: 4, // Teamwork
        9: 4, // Problem Solving
        10: 4 // Adaptability
      };
      const calculated = calculateRoleReadiness(sampleAnswers);

      const demoResult: AssessmentResult = {
        id: 'sample-assessment-alex-rivera',
        studentId: studentId,
        totalScore: calculated.totalScore,
        maxScore: calculated.maxScore,
        percentage: calculated.percentage,
        overallScore: calculated.overallScore,
        answers: sampleAnswers,
        skillScores: calculated.skillScores,
        roleReadiness: calculated.roleReadiness,
        recommendedRole: calculated.recommendedRole,
        recommendationMessage: calculated.recommendationMessage,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      };

      res.json({
        success: true,
        message: 'Latest assessment retrieved (sandbox baseline mode)',
        data: demoResult,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!data) {
      res.json({
        success: true,
        message: 'No previous assessments found for this student',
        data: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const result: AssessmentResult = {
      id: data.id,
      studentId: data.student_id,
      totalScore: data.total_score,
      maxScore: data.max_score,
      percentage: data.percentage,
      answers: data.answers || {},
      skillScores: data.skill_scores || {},
      roleReadiness: data.role_readiness,
      recommendedRole: data.recommended_role,
      recommendationMessage: data.recommendation_message,
      completedAt: data.completed_at,
    };

    res.json({
      success: true,
      message: 'Latest assessment record retrieved',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve assessment';
    res.status(500).json({
      success: false,
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/assessments/submit
 * Validates 10-question assessment answers (1-5 rating), computes role readiness, and saves to database
 */
assessmentsRouter.post('/submit', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required to submit assessment',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Invalid payload. "answers" object is required.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validation: Exactly 10 questions must be answered with ratings between 1 and 5
    const missingQuestionIds: number[] = [];
    const invalidRatings: { questionId: number; rating: unknown }[] = [];

    for (const q of ASSESSMENT_QUESTIONS) {
      const val = answers[q.id];
      if (val === undefined || val === null) {
        missingQuestionIds.push(q.id);
      } else if (typeof val !== 'number' || val < 1 || val > 5) {
        invalidRatings.push({ questionId: q.id, rating: val });
      }
    }

    if (missingQuestionIds.length > 0) {
      res.status(400).json({
        success: false,
        error: `Incomplete assessment. The following questions are missing answers: [${missingQuestionIds.join(', ')}].`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (invalidRatings.length > 0) {
      res.status(400).json({
        success: false,
        error: `Invalid ratings detected. All answers must be a confidence rating between 1 and 5.`,
        data: { invalidRatings },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Calculate deterministic role readiness using the shared rule-based engine
    const calculated = calculateRoleReadiness(answers);
    const completedTimestamp = new Date().toISOString();

    if (!isSupabaseConfigured) {
      // Sandbox fallback response - cache in memory so GET /latest reflects this submission
      const mockResult: AssessmentResult = {
        id: `assessment-dev-${Date.now()}`,
        studentId: studentId,
        totalScore: calculated.totalScore,
        maxScore: calculated.maxScore,
        percentage: calculated.percentage,
        overallScore: calculated.overallScore,
        answers,
        skillScores: calculated.skillScores,
        roleReadiness: calculated.roleReadiness,
        recommendedRole: calculated.recommendedRole,
        recommendationMessage: calculated.recommendationMessage,
        completedAt: completedTimestamp,
      };

      sandboxAssessmentStore.set(studentId, mockResult);
      sandboxAssessmentStore.set('default', mockResult);

      res.json({
        success: true,
        message: 'Assessment submitted & role readiness calculated (sandbox mode)',
        data: mockResult,
        timestamp: completedTimestamp,
      });
      return;
    }

    // Persist to Supabase PostgreSQL database
    const insertPayload = {
      student_id: studentId,
      total_score: calculated.totalScore,
      max_score: calculated.maxScore,
      percentage: calculated.percentage,
      answers,
      skill_scores: calculated.skillScores,
      role_readiness: calculated.roleReadiness,
      recommended_role: calculated.recommendedRole,
      recommendation_message: calculated.recommendationMessage,
      completed_at: completedTimestamp,
    };

    const { data, error } = await supabase
      .from('assessments')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      res.status(500).json({
        success: false,
        error: `Database save failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const savedResult: AssessmentResult = {
      id: data.id,
      studentId: data.student_id,
      totalScore: data.total_score,
      maxScore: data.max_score,
      percentage: data.percentage,
      answers: data.answers,
      skillScores: data.skill_scores,
      roleReadiness: data.role_readiness,
      recommendedRole: data.recommended_role,
      recommendationMessage: data.recommendation_message,
      completedAt: data.completed_at,
    };

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully. Role readiness index calculated.',
      data: savedResult,
      timestamp: completedTimestamp,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Assessment submission failed';
    res.status(500).json({
      success: false,
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});