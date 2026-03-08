import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireFaculty, requireStudent } from '../middleware/requireRole.js';
import * as assessmentController from '../controllers/assessmentController.js';

/**
 * Assessment Routes
 * 
 * All routes require authentication. Role-specific routes use requireFaculty
 * or requireStudent middleware to enforce authorization.
 * 
 * Route Structure:
 * - Faculty-only routes: Create, manage, view all submissions, analytics
 * - Student-only routes: View assigned, submit, view own submissions
 */

const router = Router();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Faculty-Only Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Create new assessment
 * POST /api/assessments
 * 
 * Required: title, description, language
 * Optional: instructions, starter_code, test_cases, time_limit_minutes, due_at
 */
router.post(
  '/assessments',
  requireAuth,
  requireFaculty,
  assessmentController.createAssessment
);

/**
 * Get all assessments created by this faculty member
 * GET /api/assessments
 * 
 * Returns: Array of assessments with summary data
 */
router.get(
  '/assessments',
  requireAuth,
  requireFaculty,
  assessmentController.getFacultyAssessments
);

/**
 * Get detailed assessment (with all test cases)
 * GET /api/assessments/:assessmentId
 * 
 * Returns: Full assessment details including hidden test cases
 * Note: Students use /assessments/:id/take endpoint instead
 */
router.get(
  '/assessments/:assessmentId',
  requireAuth,
  requireFaculty,
  assessmentController.getAssessmentDetails
);

/**
 * Update an assessment
 * PUT /api/assessments/:assessmentId
 * 
 * Can update any field. Faculty can only update their own assessments.
 */
router.put(
  '/assessments/:assessmentId',
  requireAuth,
  requireFaculty,
  assessmentController.updateAssessment
);

/**
 * Delete an assessment
 * DELETE /api/assessments/:assessmentId
 * 
 * Faculty can only delete their own assessments.
 * Consider preventing deletion if submissions exist.
 */
router.delete(
  '/assessments/:assessmentId',
  requireAuth,
  requireFaculty,
  assessmentController.deleteAssessment
);

/**
 * Publish an assessment
 * POST /api/assessments/:assessmentId/publish
 * 
 * Makes assessment visible and available to students.
 * Should validate that assessment has test cases before publishing.
 */
router.post(
  '/assessments/:assessmentId/publish',
  requireAuth,
  requireFaculty,
  assessmentController.publishAssessment
);

/**
 * Unpublish an assessment
 * POST /api/assessments/:assessmentId/unpublish
 * 
 * Removes assessment from student view.
 * Existing submissions remain but new submissions are blocked.
 */
router.post(
  '/assessments/:assessmentId/unpublish',
  requireAuth,
  requireFaculty,
  assessmentController.unpublishAssessment
);

/**
 * Get all submissions for an assessment
 * GET /api/assessments/:assessmentId/submissions
 * 
 * Returns: Array of all student submissions with summary data
 * Includes integrity flags for proctoring
 */
router.get(
  '/assessments/:assessmentId/submissions',
  requireAuth,
  requireFaculty,
  assessmentController.getAssessmentSubmissions
);

/**
 * Get analytics for an assessment
 * GET /api/assessments/:assessmentId/analytics
 * 
 * Returns: Aggregated statistics (score distribution, pass rate, etc.)
 */
router.get(
  '/assessments/:assessmentId/analytics',
  requireAuth,
  requireFaculty,
  assessmentController.getAssessmentAnalytics
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Student-Only Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get all assessments assigned to this student
 * GET /api/assessments/assigned
 * 
 * Returns: Published assessments with student's submission status
 */
router.get(
  '/assessments/assigned',
  requireAuth,
  requireStudent,
  assessmentController.getAssignedAssessments
);

/**
 * Get assessment for taking (student view)
 * GET /api/assessments/:assessmentId/take
 * 
 * Returns: Assessment with starter code and visible test cases only
 * Hidden test cases are not included in response
 * Includes student's attempt status
 */
router.get(
  '/assessments/:assessmentId/take',
  requireAuth,
  requireStudent,
  assessmentController.getAssessmentForStudent
);

/**
 * Submit code for assessment
 * POST /api/assessments/:assessmentId/submit
 * 
 * Required: code
 * Optional: time_taken_seconds, integrity_events
 * 
 * Runs code against all test cases and calculates score.
 * Checks attempt limits and due dates.
 */
router.post(
  '/assessments/:assessmentId/submit',
  requireAuth,
  requireStudent,
  assessmentController.submitAssessment
);

/**
 * Get student's own submissions for an assessment
 * GET /api/assessments/:assessmentId/my-submissions
 * 
 * Returns: Array of this student's submissions with scores
 */
router.get(
  '/assessments/:assessmentId/my-submissions',
  requireAuth,
  requireStudent,
  assessmentController.getStudentSubmissions
);

/**
 * Get detailed submission (student's own only)
 * GET /api/submissions/:submissionId
 * 
 * Returns: Full submission details with test results
 * Students can only view their own submissions
 */
router.get(
  '/submissions/:submissionId',
  requireAuth,
  requireStudent,
  assessmentController.getSubmissionDetails
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Route Summary
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Faculty Routes (requireFaculty):
 * - POST   /api/assessments                               Create assessment
 * - GET    /api/assessments                               List faculty's assessments
 * - GET    /api/assessments/:assessmentId                 Get assessment details
 * - PUT    /api/assessments/:assessmentId                 Update assessment
 * - DELETE /api/assessments/:assessmentId                 Delete assessment
 * - POST   /api/assessments/:assessmentId/publish         Publish assessment
 * - POST   /api/assessments/:assessmentId/unpublish       Unpublish assessment
 * - GET    /api/assessments/:assessmentId/submissions     Get all submissions
 * - GET    /api/assessments/:assessmentId/analytics       Get analytics
 * 
 * Student Routes (requireStudent):
 * - GET    /api/assessments/assigned                      Get assigned assessments
 * - GET    /api/assessments/:assessmentId/take            Get assessment to take
 * - POST   /api/assessments/:assessmentId/submit          Submit solution
 * - GET    /api/assessments/:assessmentId/my-submissions  Get own submissions
 * - GET    /api/submissions/:submissionId                 Get submission details
 */

export default router;
