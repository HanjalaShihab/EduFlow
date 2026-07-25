<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function __construct(
        protected UserRepository $userRepository,
        protected AuthService $authService
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $students = $this->userRepository->getStudents($institutionId);
            return response()->json($students->load(['department', 'program', 'semester', 'section']));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch students.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $student = $this->userRepository->findOrFail($id);
            return response()->json($student->load(['department', 'program', 'semester', 'section', 'institution']));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Student not found.'], 404);
        }
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        try {
            $student = $this->userRepository->approve($id, $request->user()->id);
            return response()->json(['message' => 'Student approved.', 'student' => $student]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Approval failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function reject(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate(['reason' => ['required', 'string']]);
            $student = $this->userRepository->reject($id, $request->input('reason'));
            return response()->json(['message' => 'Student rejected.', 'student' => $student]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Rejection failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function pending(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $students = $this->userRepository->getPendingByInstitution($institutionId);
            return response()->json($students->load(['department', 'program', 'semester', 'section']));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch pending students.', 'error' => $e->getMessage()], 500);
        }
    }
}
