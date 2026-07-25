<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(
        protected AttendanceService $attendanceService
    ) {}

    public function createSession(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'course_id' => ['required', 'exists:courses,id'],
                'section_id' => ['required', 'exists:sections,id'],
                'institution_id' => ['required', 'exists:institutions,id'],
                'teacher_id' => ['required', 'exists:users,id'],
                'room' => ['required', 'string', 'max:100'],
                'start_time' => ['required', 'date'],
                'end_time' => ['required', 'date', 'after:start_time'],
                'attendance_window' => ['sometimes', 'integer', 'min:1', 'max:60'],
                'custom_keyword' => ['sometimes', 'string', 'max:20'],
            ]);

            $session = $this->attendanceService->createSession($validated);

            if (isset($validated['custom_keyword'])) {
                $this->attendanceService->generateKeyword($session, $validated['custom_keyword']);
            }

            return response()->json([
                'message' => 'Attendance session created successfully.',
                'session' => $session->load(['course', 'section', 'teacher']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create session.', 'error' => $e->getMessage()], 500);
        }
    }

    public function generateKeyword(int $sessionId, Request $request): JsonResponse
    {
        try {
            $session = AttendanceSession::findOrFail($sessionId);
            $customKeyword = $request->input('keyword');

            if ($session->keywords()->active()->notExpired()->exists()) {
                return response()->json(['message' => 'Session already has an active keyword.'], 409);
            }

            $keyword = $this->attendanceService->generateKeyword($session, $customKeyword);
            return response()->json([
                'message' => 'Keyword generated successfully.',
                'keyword_display' => $keyword->keyword_display,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate keyword.', 'error' => $e->getMessage()], 500);
        }
    }

    public function markAttendance(int $sessionId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'keyword' => ['required', 'string'],
                'face_confidence' => ['required', 'numeric', 'min:0', 'max:1'],
                'liveness_score' => ['required', 'numeric', 'min:0', 'max:1'],
                'liveness_passed' => ['required', 'boolean'],
                'face_matched' => ['required', 'boolean'],
                'captured_image' => ['sometimes', 'string'],
                'ai_response' => ['sometimes', 'array'],
            ]);

            $session = AttendanceSession::findOrFail($sessionId);

            if ($session->status !== 'active') {
                return response()->json(['message' => 'This attendance session is not active.'], 422);
            }

            $student = $request->user();
            $record = $this->attendanceService->markAttendance($session, $student, $validated);

            return response()->json([
                'message' => 'Attendance recorded.',
                'record' => $record->load('student'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to mark attendance.', 'error' => $e->getMessage()], 500);
        }
    }

    public function endSession(int $sessionId): JsonResponse
    {
        try {
            $session = $this->attendanceService->endSession($sessionId);
            return response()->json([
                'message' => 'Session ended.',
                'session' => $session,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to end session.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getSession(int $sessionId): JsonResponse
    {
        try {
            $data = $this->attendanceService->getSessionAttendance($sessionId);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Session not found.'], 404);
        }
    }

    public function reviewAttendance(int $recordId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'decision' => ['required', 'string', 'in:approve,reject,excused'],
                'reason' => ['sometimes', 'string', 'max:500'],
            ]);

            $record = $this->attendanceService->reviewAttendance(
                $recordId,
                $request->user(),
                $validated['decision'],
                $validated['reason'] ?? null
            );

            return response()->json([
                'message' => 'Attendance reviewed.',
                'record' => $record,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Review failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function studentHistory(int $studentId, Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $data = $this->attendanceService->getStudentAttendanceHistory($studentId, $institutionId);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch history.', 'error' => $e->getMessage()], 500);
        }
    }

    public function activeSessions(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $sessions = app(\App\Repositories\AttendanceSessionRepository::class)->getActiveSessions($institutionId);
            return response()->json($sessions);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch sessions.', 'error' => $e->getMessage()], 500);
        }
    }

    public function teacherSessions(int $teacherId): JsonResponse
    {
        try {
            $sessions = app(\App\Repositories\AttendanceSessionRepository::class)->getTeacherSessions($teacherId);
            return response()->json($sessions);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch sessions.', 'error' => $e->getMessage()], 500);
        }
    }

    public function pendingReviews(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $records = app(\App\Repositories\AttendanceRecordRepository::class)->getPendingReviews($institutionId);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch reviews.', 'error' => $e->getMessage()], 500);
        }
    }
}

