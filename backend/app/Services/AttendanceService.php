<?php

namespace App\Services;

use App\Models\AttendanceKeyword;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use App\Models\User;
use App\Repositories\AttendanceRecordRepository;
use App\Repositories\AttendanceSessionRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function __construct(
        protected AttendanceSessionRepository $sessionRepository,
        protected AttendanceRecordRepository $recordRepository,
        protected UserRepository $userRepository
    ) {}

    public function createSession(array $data): AttendanceSession
    {
        return DB::transaction(function () use ($data) {
            $session = $this->sessionRepository->create($data);
            return $session->load(['course', 'section']);
        });
    }

    public function generateKeyword(AttendanceSession $session, ?string $customKeyword = null): AttendanceKeyword
    {
        $keyword = $customKeyword ?? $this->generateRandomKeyword();

        return $session->keywords()->create([
            'institution_id' => $session->institution_id,
            'created_by' => $session->teacher_id,
            'keyword_hash' => bcrypt(strtolower($keyword)),
            'keyword_display' => $keyword,
            'type' => $customKeyword ? 'manual' : 'auto',
            'is_active' => true,
            'expires_at' => $session->end_time,
        ]);
    }

    protected function generateRandomKeyword(): string
    {
        $words = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL',
                  'INDIA', 'JULIET', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA',
                  'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY',
                  'XRAY', 'YANKEE', 'ZULU'];

        $word1 = $words[array_rand($words)];
        $word2 = $words[array_rand($words)];

        return $word1 . '-' . $word2 . '-' . random_int(10, 99);
    }

    public function validateKeyword(AttendanceSession $session, string $inputKeyword): bool
    {
        $keyword = $this->getActiveKeyword($session);
        if (!$keyword) {
            return false;
        }

        return strtolower(trim($inputKeyword)) === strtolower(trim($keyword->keyword_display));
    }

    public function getActiveKeyword(AttendanceSession $session): ?AttendanceKeyword
    {
        return $session->keywords()
            ->active()
            ->notExpired()
            ->latest()
            ->first();
    }

    public function markAttendance(AttendanceSession $session, User $student, array $data): AttendanceRecord
    {
        return DB::transaction(function () use ($session, $student, $data) {
            $keywordValid = $this->validateKeyword($session, $data['keyword'] ?? '');

            if (!$keywordValid) {
                return $this->recordRepository->markAttendance([
                    'institution_id' => $session->institution_id,
                    'attendance_session_id' => $session->id,
                    'student_id' => $student->id,
                    'status' => 'rejected',
                    'face_confidence' => $data['face_confidence'] ?? 0,
                    'liveness_score' => $data['liveness_score'] ?? 0,
                    'liveness_passed' => $data['liveness_passed'] ?? false,
                    'face_matched' => $data['face_matched'] ?? false,
                    'keyword_matched' => false,
                    'captured_image' => $data['captured_image'] ?? null,
                    'ai_response' => $data['ai_response'] ?? null,
                    'metadata' => ['reason' => 'Incorrect attendance keyword'],
                    'marked_at' => now(),
                ]);
            }

            $faceConfidence = $data['face_confidence'] ?? 0;
            $livenessScore = $data['liveness_score'] ?? 0;
            $livenessPassed = $data['liveness_passed'] ?? false;

            if (!$livenessPassed) {
                return $this->recordRepository->markAttendance([
                    'institution_id' => $session->institution_id,
                    'attendance_session_id' => $session->id,
                    'student_id' => $student->id,
                    'status' => 'rejected',
                    'face_confidence' => $faceConfidence,
                    'liveness_score' => $livenessScore,
                    'liveness_passed' => false,
                    'face_matched' => $data['face_matched'] ?? false,
                    'keyword_matched' => true,
                    'captured_image' => $data['captured_image'] ?? null,
                    'ai_response' => $data['ai_response'] ?? null,
                    'metadata' => ['reason' => 'Liveness detection failed'],
                    'marked_at' => now(),
                ]);
            }

            $status = $this->determineAttendanceStatus($faceConfidence);

            return $this->recordRepository->markAttendance([
                'institution_id' => $session->institution_id,
                'attendance_session_id' => $session->id,
                'student_id' => $student->id,
                'status' => $status,
                'face_confidence' => $faceConfidence,
                'liveness_score' => $livenessScore,
                'liveness_passed' => true,
                'face_matched' => true,
                'keyword_matched' => true,
                'captured_image' => $data['captured_image'] ?? null,
                'ai_response' => $data['ai_response'] ?? null,
                'metadata' => [
                    'face_confidence' => $faceConfidence,
                    'liveness_score' => $livenessScore,
                ],
                'marked_at' => now(),
            ]);
        });
    }

    protected function determineAttendanceStatus(float $faceConfidence): string
    {
        if ($faceConfidence >= 0.85) {
            return 'present';
        } elseif ($faceConfidence >= 0.60) {
            return 'pending_review';
        } else {
            return 'rejected';
        }
    }

    public function reviewAttendance(int $recordId, User $teacher, string $decision, ?string $reason = null): AttendanceRecord
    {
        return DB::transaction(function () use ($recordId, $teacher, $decision, $reason) {
            $record = $this->recordRepository->findOrFail($recordId);

            if ($record->status !== 'pending_review') {
                throw ValidationException::withMessages([
                    'record' => ['This attendance record is not pending review.'],
                ]);
            }

            $newStatus = match ($decision) {
                'approve' => 'present',
                'reject' => 'rejected',
                'excused' => 'excused',
                default => throw ValidationException::withMessages([
                    'decision' => ['Invalid review decision.'],
                ]),
            };

            $record->update(['status' => $newStatus]);

            $record->manualReview()->create([
                'institution_id' => $record->institution_id,
                'attendance_record_id' => $record->id,
                'reviewed_by' => $teacher->id,
                'student_id' => $record->student_id,
                'decision' => $decision,
                'reason' => $reason,
                'reviewed_at' => now(),
            ]);

            return $record->fresh()->load(['student', 'manualReview']);
        });
    }

    public function endSession(int $sessionId): AttendanceSession
    {
        return $this->sessionRepository->endSession($sessionId);
    }

    public function getSessionAttendance(int $sessionId): array
    {
        $session = $this->sessionRepository->findOrFail($sessionId);

        $records = $this->recordRepository->getSessionRecords($sessionId);

        $stats = [
            'total' => $records->count(),
            'present' => $records->where('status', 'present')->count(),
            'late' => $records->where('status', 'late')->count(),
            'absent' => $records->where('status', 'absent')->count(),
            'pending_review' => $records->where('status', 'pending_review')->count(),
            'rejected' => $records->where('status', 'rejected')->count(),
        ];

        $attendanceRate = $stats['total'] > 0
            ? round(($stats['present'] + $stats['late']) / $stats['total'] * 100, 2)
            : 0;

        return [
            'session' => $session,
            'records' => $records,
            'statistics' => $stats,
            'attendance_rate' => $attendanceRate,
        ];
    }

    public function getStudentAttendanceHistory(int $studentId, int $institutionId): array
    {
        $records = $this->recordRepository->getStudentRecords($studentId, $institutionId);
        $stats = $this->recordRepository->getStudentAttendanceStats($studentId, $institutionId);

        return [
            'records' => $records,
            'statistics' => $stats,
        ];
    }
}

