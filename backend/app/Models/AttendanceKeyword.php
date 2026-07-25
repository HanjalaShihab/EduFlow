<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceKeyword extends Model
{
    use HasFactory;

    protected $fillable = [
        'attendance_session_id',
        'institution_id',
        'created_by',
        'keyword_hash',
        'keyword_display',
        'type',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
    ];

    protected $hidden = [
        'keyword_hash',
    ];

    public function attendanceSession()
    {
        return $this->belongsTo(AttendanceSession::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
        });
    }
}

