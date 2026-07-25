<?php

namespace App\Repositories;

use App\Models\AttendanceSession;
use Illuminate\Database\Eloquent\Collection;

class AttendanceSessionRepository extends BaseRepository
{
    public function __construct(AttendanceSession $model)
    {
        parent::__construct($model);
    }

    public function getActiveSessions(int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->active()
            ->with(['course', 'section', 'teacher', 'activeKeyword'])
            ->get();
    }

    public function getTeacherSessions(int $teacherId): Collection
    {
        return $this->model->byTeacher($teacherId)
            ->with(['course', 'section', 'activeKeyword'])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getTodaySessions(int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->whereDate('start_time', today())
            ->with(['course', 'section', 'activeKeyword'])
            ->orderBy('start_time')
            ->get();
    }

    public function startSession(int $id): AttendanceSession
    {
        return $this->update($id, [
            'status' => 'active',
            'started_at' => now(),
        ]);
    }

    public function endSession(int $id): AttendanceSession
    {
        $session = $this->findOrFail($id);
        $session->keywords()->where('is_active', true)->update(['is_active' => false]);
        return $this->update($id, [
            'status' => 'completed',
            'ended_at' => now(),
        ]);
    }

    public function pauseSession(int $id): AttendanceSession
    {
        return $this->update($id, ['status' => 'paused']);
    }

    public function resumeSession(int $id): AttendanceSession
    {
        return $this->update($id, ['status' => 'active']);
    }
}

