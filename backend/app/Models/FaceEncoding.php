<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaceEncoding extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institution_id',
        'encoding_encrypted',
        'image_path',
        'pose',
        'confidence',
        'is_primary',
    ];

    protected $casts = [
        'confidence' => 'float',
        'is_primary' => 'boolean',
    ];

    protected $hidden = [
        'encoding_encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeByPose($query, $pose)
    {
        return $query->where('pose', $pose);
    }
}

