<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'institution_id',
        'phone',
        'student_id',
        'institution_email',
        'avatar',
        'role',
        'status',
        'gender',
        'date_of_birth',
        'bio',
        'address',
        'department_id',
        'program_id',
        'semester_id',
        'section_id',
        'rejection_reason',
        'approved_at',
        'face_enrolled_at',
        'settings',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'approved_at' => 'datetime',
        'face_enrolled_at' => 'datetime',
        'date_of_birth' => 'date',
        'settings' => 'array',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function faceEncodings()
    {
        return $this->hasMany(FaceEncoding::class);
    }

    public function primaryFaceEncoding()
    {
        return $this->hasOne(FaceEncoding::class)->where('is_primary', true);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class, 'student_id');
    }

    public function taughtCourses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function taughtSections()
    {
        return $this->hasMany(Section::class, 'teacher_id');
    }

    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class, 'teacher_id');
    }

    public function manualReviews()
    {
        return $this->hasMany(ManualReview::class, 'reviewed_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'user_id');
    }

    public function scopeByInstitution($query, $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function isPlatformAdmin(): bool
    {
        return $this->role === 'platform_admin';
    }

    public function isInstitutionAdmin(): bool
    {
        return $this->role === 'institution_admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function belongsToInstitution($institutionId): bool
    {
        return $this->institution_id === $institutionId;
    }
}

