<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\RegisterInstitutionRequest;
use App\Http\Requests\Institution\UpdateInstitutionRequest;
use App\Models\Department;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Services\InstitutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function __construct(
        protected InstitutionService $institutionService
    ) {}

    public function register(RegisterInstitutionRequest $request): JsonResponse
    {
        try {
            $institution = $this->institutionService->register($request->validated());
            return response()->json([
                'message' => 'Institution registered successfully. Awaiting approval.',
                'institution' => $institution,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Registration failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        try {
            $institution = $this->institutionService->approve($id, $request->user()->id);
            return response()->json([
                'message' => 'Institution approved successfully.',
                'institution' => $institution,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Approval failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function reject(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate(['reason' => ['required', 'string']]);
            $institution = $this->institutionService->reject($id, $request->input('reason'));
            return response()->json([
                'message' => 'Institution rejected.',
                'institution' => $institution,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Rejection failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function suspend(int $id): JsonResponse
    {
        try {
            $institution = $this->institutionService->suspend($id);
            return response()->json([
                'message' => 'Institution suspended.',
                'institution' => $institution,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Suspension failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $institution = $this->institutionService->findOrFail($id);
            return response()->json(['institution' => $institution]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Institution not found.'], 404);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 15);
            $institutions = $this->institutionService->paginate($perPage);
            return response()->json($institutions);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch institutions.', 'error' => $e->getMessage()], 500);
        }
    }

    public function onboardingProgress(int $id): JsonResponse
    {
        try {
            $progress = $this->institutionService->getOnboardingProgress($id);
            return response()->json($progress);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get progress.', 'error' => $e->getMessage()], 500);
        }
    }

    public function dashboard(int $id): JsonResponse
    {
        try {
            $stats = $this->institutionService->getDashboardStats($id);
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get dashboard.', 'error' => $e->getMessage()], 500);
        }
    }

    // ─── Public endpoints for registration ─────────────────────────────────────

    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('q', '');
            $institutions = $this->institutionService->searchActive($query);
            return response()->json(['data' => $institutions]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Search failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function departments(int $id): JsonResponse
    {
        try {
            $departments = Department::where('institution_id', $id)
                ->where('is_active', true)
                ->select('id', 'name', 'code')
                ->get();
            return response()->json(['data' => $departments]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch departments.', 'error' => $e->getMessage()], 500);
        }
    }

    public function programs(int $id): JsonResponse
    {
        try {
            $programs = Program::where('institution_id', $id)
                ->where('is_active', true)
                ->select('id', 'name', 'code')
                ->get();
            return response()->json(['data' => $programs]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch programs.', 'error' => $e->getMessage()], 500);
        }
    }

    public function semesters(int $id): JsonResponse
    {
        try {
            $semesters = Semester::where('institution_id', $id)
                ->where('is_active', true)
                ->select('id', 'name', 'code', 'semester_number')
                ->get();
            return response()->json(['data' => $semesters]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch semesters.', 'error' => $e->getMessage()], 500);
        }
    }

    public function sections(int $id): JsonResponse
    {
        try {
            $sections = Section::where('institution_id', $id)
                ->where('is_active', true)
                ->select('id', 'name', 'code', 'course_id')
                ->get();
            return response()->json(['data' => $sections]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch sections.', 'error' => $e->getMessage()], 500);
        }
    }
}

