<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $teachers = $this->userRepository->getTeachers($institutionId);
            return response()->json($teachers->load(['department', 'institution']));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch teachers.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
                'institution_id' => ['required', 'exists:institutions,id'],
                'department_id' => ['required', 'exists:departments,id'],
                'phone' => ['sometimes', 'string', 'max:20'],
            ]);

            $validated['password'] = bcrypt($validated['password']);
            $validated['role'] = 'teacher';
            $validated['status'] = 'active';

            $teacher = User::create($validated);
            return response()->json(['message' => 'Teacher created.', 'teacher' => $teacher], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Creation failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $teacher = $this->userRepository->findOrFail($id);
            return response()->json($teacher->load(['department', 'institution']));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Teacher not found.'], 404);
        }
    }
}

