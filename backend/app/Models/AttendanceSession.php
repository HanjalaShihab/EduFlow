<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'institution_id',
        'teacher_id',
        'course_id',
        'section_id',
        'semester_id',
        'title',
        'description',
        'room',
        'start_time',
        'end_time',
        'attendance_window_minutes',
        'status',
        'type',
        'settings',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'attendance_window_minutes' => 'integer',
        'settings' => 'array',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function keywords()
    {
        return $this->hasMany(AttendanceKeyword::class);
    }

    public function activeKeyword()
    {
        return $this->hasOne(AttendanceKeyword::class)->where('is_active', true);
    }

    public function records()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
