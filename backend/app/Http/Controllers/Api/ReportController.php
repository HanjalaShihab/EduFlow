<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\AttendanceRecordRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(
        protected AttendanceRecordRepository $recordRepository
    ) {}

    public function daily(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $date = $request->input('date', now()->toDateString());
            $records = $this->recordRepository->getDailyReport($institutionId, $date);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate report.', 'error' => $e->getMessage()], 500);
        }
    }

    public function weekly(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $weekStart = $request->input('week_start', now()->startOfWeek()->toDateString());
            $weekEnd = $request->input('week_end', now()->endOfWeek()->toDateString());
            $records = $this->recordRepository->getWeeklyReport($institutionId, $weekStart, $weekEnd);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate report.', 'error' => $e->getMessage()], 500);
        }
    }

    public function monthly(Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $month = $request->input('month', now()->month);
            $year = $request->input('year', now()->year);
            $records = $this->recordRepository->getMonthlyReport($institutionId, $month, $year);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate report.', 'error' => $e->getMessage()], 500);
        }
    }

    public function byStudent(int $studentId, Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $records = $this->recordRepository->getStudentAttendanceHistory($studentId, $institutionId);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch report.', 'error' => $e->getMessage()], 500);
        }
    }

    public function byCourse(int $courseId, Request $request): JsonResponse
    {
        try {
            $institutionId = $request->input('institution_id', $request->user()->institution_id);
            $records = $this->recordRepository->getCourseAttendanceReport($courseId, $institutionId);
            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch report.', 'error' => $e->getMessage()], 500);
        }
    }

    public function exportPdf(Request $request): JsonResponse
    {
        // In production, use a PDF library like DomPDF or Barryvdh/Laravel-DomPDF
        return response()->json(['message' => 'PDF export endpoint ready.', 'data' => $request->all()]);
    }

    public function exportExcel(Request $request): JsonResponse
    {
        // In production, use a library like Laravel-Excel (Maatwebsite)
        return response()->json(['message' => 'Excel export endpoint ready.', 'data' => $request->all()]);
    }
}

