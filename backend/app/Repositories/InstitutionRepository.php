<?php

namespace App\Repositories;

use App\Models\Institution;

class InstitutionRepository extends BaseRepository
{
    public function __construct(Institution $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Institution
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function findByEmail(string $email): ?Institution
    {
        return $this->model->where('email', $email)->first();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->active()->get();
    }

    public function searchActive(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->active()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('slug', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('city', 'like', "%{$query}%")
                  ->orWhere('state', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'slug', 'email', 'city', 'state', 'type', 'logo')
            ->limit(20)
            ->get();
    }

    public function getPending(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->pending()->get();
    }

    public function approve(int $id, int $approvedBy): Institution
    {
        return $this->update($id, [
            'status' => 'active',
            'approved_by' => $approvedBy,
            'approved_at' => now(),
        ]);
    }

    public function reject(int $id, string $reason): Institution
    {
        return $this->update($id, [
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }

    public function suspend(int $id): Institution
    {
        return $this->update($id, [
            'status' => 'suspended',
            'suspended_at' => now(),
        ]);
    }
}

