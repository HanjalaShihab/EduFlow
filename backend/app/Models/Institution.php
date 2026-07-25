<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Institution extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'website',
        'logo',
        'type',
        'status',
        'verification_document',
        'rejection_reason',
        'approved_at',
        'suspended_at',
        'approved_by',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'approved_at' => 'datetime',
        'suspended_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Institution $institution) {
            if (empty($institution->slug)) {
                $institution->slug = Str::slug($institution->name) . '-' . Str::random(6);
            }
        });
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function programs()
    {
        return $this->hasMany(Program::class);
    }

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function faceEncodings()
    {
        return $this->hasMany(FaceEncoding::class);
    }

    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function manualReviews()
    {
        return $this->hasMany(ManualReview::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }
}
