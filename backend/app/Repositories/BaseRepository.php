<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns);
    }

    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->find($id, $columns);
    }

    public function findOrFail(int $id, array $columns = ['*']): Model
    {
        return $this->model->findOrFail($id, $columns);
    }

    public function findByField(string $field, mixed $value, array $columns = ['*']): ?Model
    {
        return $this->model->where($field, $value)->first($columns);
    }

    public function findWhere(array $conditions, array $columns = ['*']): Collection
    {
        $query = $this->model->newQuery();
        foreach ($conditions as $field => $value) {
            $query->where($field, $value);
        }
        return $query->get($columns);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);
        return $record->fresh();
    }

    public function updateOrCreate(array $attributes, array $values = []): Model
    {
        return $this->model->updateOrCreate($attributes, $values);
    }

    public function delete(int $id): bool
    {
        return $this->findOrFail($id)->delete();
    }

    public function forceDelete(int $id): bool
    {
        return $this->findOrFail($id)->forceDelete();
    }

    public function restore(int $id): bool
    {
        return $this->findOrFail($id)->restore();
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function countWhere(array $conditions): int
    {
        $query = $this->model->newQuery();
        foreach ($conditions as $field => $value) {
            $query->where($field, $value);
        }
        return $query->count();
    }

    public function exists(array $conditions): bool
    {
        $query = $this->model->newQuery();
        foreach ($conditions as $field => $value) {
            $query->where($field, $value);
        }
        return $query->exists();
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function getModel(): Model
    {
        return $this->model;
    }
}

