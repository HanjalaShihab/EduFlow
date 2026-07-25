<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'institution_id',
        'department_id',
        'program_id',
        'semester_id',
        'name',
        'code',
        'credits',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
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

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
