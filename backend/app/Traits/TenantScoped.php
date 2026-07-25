<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait TenantScoped
{
    protected static function bootTenantScoped(): void
    {
        static::addGlobalScope('institution', function (Builder $builder) {
            if (auth()->check() && auth()->user()->institution_id) {
                $builder->where('institution_id', auth()->user()->institution_id);
            }
        });

        static::creating(function ($model) {
            if (auth()->check() && auth()->user()->institution_id) {
                $model->institution_id = auth()->user()->institution_id;
            }
        });
    }

    public function scopeByInstitution(Builder $query, int $institutionId): Builder
    {
        return $query->where('institution_id', $institutionId);
    }
}

