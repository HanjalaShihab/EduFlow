<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'attendance_session_id',
        'student_id',
        'attendance_keyword_id',
        'status',
        'face_confidence',
        'liveness_score',
        'liveness_passed',
        'face_matched',
        'keyword_matched',
        'captured_image',
        'liveness_video',
        'ai_response',
        'metadata',
        'marked_at',
    ];

    protected $casts = [
        'face_confidence' => 'float',
        'liveness_score' => 'float',
        'liveness_passed' => 'boolean',
        'face_matched' => 'boolean',
        'keyword_matched' => 'boolean',
        'ai_response' => 'array',
        'metadata' => 'array',
        'marked_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function attendanceSession()
    {
        return $this->belongsTo(AttendanceSession::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function keyword()
    {
        return $this->belongsTo(AttendanceKeyword::class, 'attendance_keyword_id');
    }

    public function manualReview()
    {
        return $this->hasOne(ManualReview::class);
    }

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    public function scopePendingReview($query)
    {
        return $query->where('status', 'pending_review');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function isPresent(): bool
    {
        return $this->status === 'present';
    }

    public function isLate(): bool
    {
        return $this->status === 'late';
    }

    public function isPendingReview(): bool
    {
        return $this->status === 'pending_review';
    }
}
