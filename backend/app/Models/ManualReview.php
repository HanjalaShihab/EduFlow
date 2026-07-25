<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'attendance_record_id',
        'reviewed_by',
        'student_id',
        'decision',
        'reason',
        'teacher_notes',
        'evidence',
        'reviewed_at',
    ];

    protected $casts = [
        'evidence' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function attendanceRecord()
    {
        return $this->belongsTo(AttendanceRecord::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
