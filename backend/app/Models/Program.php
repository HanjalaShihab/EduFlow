<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'institution_id',
        'department_id',
        'name',
        'code',
        'level',
        'duration_years',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration_years' => 'integer',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

