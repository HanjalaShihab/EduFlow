<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'institution_id',
        'course_id',
        'semester_id',
        'teacher_id',
        'name',
        'code',
        'capacity',
        'room',
        'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->hasMany(User::class, 'section_id');
    }

    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

