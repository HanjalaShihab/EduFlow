<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByStudentId(string $studentId, int $institutionId): ?User
    {
        return $this->model->where('student_id', $studentId)
            ->where('institution_id', $institutionId)
            ->first();
    }

    public function getByRole(string $role, int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->byRole($role)
            ->get();
    }

    public function getPendingByInstitution(int $institutionId): Collection
    {
        return $this->model->byInstitution($institutionId)
            ->byRole('student')
            ->pending()
            ->get();
    }

    public function getTeachers(int $institutionId): Collection
    {
        return $this->getByRole('teacher', $institutionId);
    }

    public function getStudents(int $institutionId): Collection
    {
        return $this->getByRole('student', $institutionId);
    }

    public function approve(int $id, int $approvedBy): User
    {
        return $this->update($id, [
            'status' => 'active',
            'approved_at' => now(),
        ]);
    }

    public function reject(int $id, string $reason): User
    {
        return $this->update($id, [
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }

    public function getStudentsBySection(int $sectionId): Collection
    {
        return $this->model->byRole('student')
            ->where('section_id', $sectionId)
            ->active()
            ->get();
    }

    public function getStudentsByCourse(int $courseId): Collection
    {
        return $this->model->byRole('student')
            ->whereHas('section', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->active()
            ->get();
    }
}

