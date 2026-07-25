<?php

namespace App\Repositories;

use App\Models\AttendanceRecord;
use Illuminate\Database\Eloquent\Collection;

class AttendanceRecordRepository extends BaseRepository
{
    public function __construct(AttendanceRecord $model)
    {
        parent::__construct($model);
    }

    public function getSessionRecords(int $sessionId): Collection
    {
        return $this->model->where('attendance_session_id', $sessionId)
            ->with(['student', 'keyword'])
            ->get();
    }

    public function getStudentRecords(int $studentId, int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->with(['attendanceSession.course', 'attendanceSession.section'])
            ->orderBy('marked_at', 'desc')
            ->get();
    }

    public function getPendingReviews(int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->pendingReview()
            ->with(['student', 'attendanceSession.course', 'attendanceSession.section'])
            ->get();
    }

    public function getStudentAttendanceStats(int $studentId, int $institutionId): array
    {
        $total = $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->count();

        $present = $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->present()
            ->count();

        $late = $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->late()
            ->count();

        $pending = $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->pendingReview()
            ->count();

        $absent = $this->model->byInstitution($institutionId)
            ->where('student_id', $studentId)
            ->absent()
            ->count();

        $attendancePercentage = $total > 0 ? round(($present + $late) / $total * 100, 2) : 0;

        return [
            'total' => $total,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'pending_review' => $pending,
            'attendance_percentage' => $attendancePercentage,
        ];
    }

    public function markAttendance(array $data): AttendanceRecord
    {
        return $this->create($data);
    }

    public function getAttendanceRate(int $institutionId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = $this->model->byInstitution($institutionId);

        if ($startDate) {
            $query->whereDate('marked_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('marked_at', '<=', $endDate);
        }

        $total = (clone $query)->count();
        $present = (clone $query)->whereIn('status', ['present', 'late'])->count();

        return [
            'total' => $total,
            'present' => $present,
            'rate' => $total > 0 ? round($present / $total * 100, 2) : 0,
        ];
    }
}

