<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\User;
use App\Repositories\InstitutionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InstitutionService extends BaseService
{
    public function __construct(InstitutionRepository $repository)
    {
        parent::__construct($repository);
    }

    public function register(array $data): Institution
    {
        return DB::transaction(function () use ($data) {
            // Extract admin data
            $adminData = [
                'name' => $data['admin_name'] ?? '',
                'email' => $data['admin_email'] ?? '',
                'phone' => $data['admin_phone'] ?? '',
                'password' => $data['password'] ?? '',
            ];

            // Clean institution data
            $institutionData = collect($data)->except([
                'admin_name', 'admin_email', 'admin_phone',
                'password', 'password_confirmation',
                'accept_terms', 'accept_privacy', 'established_year',
            ])->toArray();

            $institutionData['slug'] = Str::slug($institutionData['name']) . '-' . Str::random(6);
            $institutionData['status'] = 'pending';

            $institution = $this->repository->create($institutionData);

            // Create the institution admin user
            $admin = User::create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'phone' => $adminData['phone'],
                'password' => Hash::make($adminData['password']),
                'role' => 'institution_admin',
                'institution_id' => $institution->id,
                'status' => 'active',
            ]);

            return $institution;
        });
    }

    public function approve(int $id, int $approvedBy): Institution
    {
        return DB::transaction(function () use ($id, $approvedBy) {
            $institution = $this->repository->approve($id, $approvedBy);
            // TODO: Send email notification to institution
            return $institution;
        });
    }

    public function reject(int $id, string $reason): Institution
    {
        return DB::transaction(function () use ($id, $reason) {
            $institution = $this->repository->reject($id, $reason);
            // TODO: Send email notification to institution
            return $institution;
        });
    }

    public function suspend(int $id): Institution
    {
        return DB::transaction(function () use ($id) {
            $institution = $this->repository->suspend($id);
            // TODO: Send email notification to institution
            return $institution;
        });
    }

    public function getOnboardingProgress(int $institutionId): array
    {
        $institution = $this->repository->findOrFail($institutionId);

        $steps = [
            'profile_completed' => !is_null($institution->name) && !is_null($institution->email),
            'departments_created' => $institution->departments()->count() > 0,
            'programs_created' => $institution->programs()->count() > 0,
            'semesters_created' => $institution->semesters()->count() > 0,
            'courses_created' => $institution->courses()->count() > 0,
            'sections_created' => $institution->sections()->count() > 0,
            'teachers_added' => $institution->users()->byRole('teacher')->count() > 0,
            'students_enrolled' => $institution->users()->byRole('student')->count() > 0,
        ];

        $completed = count(array_filter($steps));
        $total = count($steps);

        return [
            'steps' => $steps,
            'completed' => $completed,
            'total' => $total,
            'percentage' => round(($completed / $total) * 100, 2),
        ];
    }

    public function searchActive(string $query): Collection
    {
        return $this->repository->searchActive($query);
    }

    public function getDashboardStats(int $institutionId): array
    {
        $institution = $this->repository->findOrFail($institutionId);

        return [
            'total_students' => $institution->users()->byRole('student')->count(),
            'total_teachers' => $institution->users()->byRole('teacher')->count(),
            'total_departments' => $institution->departments()->count(),
            'total_courses' => $institution->courses()->count(),
            'total_sections' => $institution->sections()->count(),
            'active_sessions' => $institution->attendanceSessions()->active()->count(),
            'pending_registrations' => $institution->users()->byRole('student')->pending()->count(),
            'pending_reviews' => $institution->attendanceRecords()->pendingReview()->count(),
        ];
    }
}

