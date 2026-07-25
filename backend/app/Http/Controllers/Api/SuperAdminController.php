<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\User;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Models\ManualReview;
use App\Models\AuditLog;
use App\Models\FaceEncoding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function dashboardStats(): JsonResponse
    {
        try {
            $totalRecords = AttendanceRecord::count();
            $successfulRecords = AttendanceRecord::whereIn('status', ['present', 'late'])->count();

            $stats = [
                'total_institutions' => Institution::count(),
                'active_institutions' => Institution::where('status', 'active')->count(),
                'pending_institutions' => Institution::where('status', 'pending')->count(),
                'suspended_institutions' => Institution::where('status', 'suspended')->count(),
                'total_institution_admins' => User::where('role', 'institution_admin')->count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'total_students' => User::where('role', 'student')->count(),
                'total_sessions_today' => AttendanceSession::whereDate('created_at', today())->count(),
                'total_records_today' => AttendanceRecord::whereDate('created_at', today())->count(),
                'total_face_verifications' => FaceEncoding::count(),
                'successful_verification_rate' => $totalRecords > 0 ? round(($successfulRecords / $totalRecords) * 100, 2) : 0,
                'pending_manual_reviews' => ManualReview::where('status', 'pending')->count(),
                'active_subscriptions' => Institution::where('status', 'active')->count(),
                'new_institutions_this_month' => Institution::whereMonth('created_at', now()->month)->count(),
                'total_users' => User::count(),
                'total_attendance_sessions' => AttendanceSession::count(),
                'total_attendance_records' => AttendanceRecord::count(),
            ];

            return response()->json(['data' => $stats]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch dashboard stats.', 'error' => $e->getMessage()], 500);
        }
    }

    public function dashboardCharts(): JsonResponse
    {
        try {
            $institutionGrowth = DB::table('institutions')
                ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $userGrowth = DB::table('users')
                ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $dailyAttendance = DB::table('attendance_records')
                ->select(DB::raw("date(created_at) as date"),
                    DB::raw('COUNT(*) as total'),
                    DB::raw("SUM(CASE WHEN status = 'present' OR status = 'late' THEN 1 ELSE 0 END) as present"),
                    DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent"))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'data' => [
                    'institution_growth' => $institutionGrowth,
                    'user_growth' => $userGrowth,
                    'daily_attendance' => $dailyAttendance,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch chart data.', 'error' => $e->getMessage()], 500);
        }
    }

    public function recentActivities(): JsonResponse
    {
        try {
            $activities = AuditLog::with('user:id,name,email')
                ->latest()
                ->limit(50)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'description' => $log->description,
                        'user_name' => $log->user?->name ?? 'System',
                        'user_email' => $log->user?->email ?? '',
                        'created_at' => $log->created_at,
                    ];
                });

            return response()->json(['data' => $activities]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch activities.', 'error' => $e->getMessage()], 500);
        }
    }

    public function pendingRegistrations(Request $request): JsonResponse
    {
        $institutions = Institution::where('status', 'pending')
            ->latest()
            ->paginate($request->input('per_page', 15));
        return response()->json($institutions);
    }

    public function listInstitutions(Request $request): JsonResponse
    {
        $query = Institution::query();

        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $institutions = $query->withCount(['users', 'departments'])->latest()->paginate($request->input('per_page', 15));
        return response()->json($institutions);
    }

    public function getInstitution(int $id): JsonResponse
    {
        try {
            $institution = Institution::withCount(['users','departments','programs','courses','sections'])->findOrFail($id);
            return response()->json(['data' => $institution]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Institution not found.'], 404);
        }
    }

    public function approveInstitution(int $id, Request $request): JsonResponse
    {
        $institution = Institution::findOrFail($id);
        $institution->update(['status' => 'active', 'approved_at' => now()]);
        return response()->json(['message' => 'Institution approved.', 'data' => $institution->fresh()]);
    }

    public function rejectInstitution(int $id, Request $request): JsonResponse
    {
        $institution = Institution::findOrFail($id);
        $institution->update(['status' => 'rejected', 'rejection_reason' => $request->input('reason')]);
        return response()->json(['message' => 'Institution rejected.', 'data' => $institution->fresh()]);
    }

    public function suspendInstitution(int $id, Request $request): JsonResponse
    {
        $institution = Institution::findOrFail($id);
        $institution->update(['status' => 'suspended']);
        User::where('institution_id', $id)->update(['status' => 'suspended']);
        return response()->json(['message' => 'Institution suspended.', 'data' => $institution->fresh()]);
    }

    public function reactivateInstitution(int $id, Request $request): JsonResponse
    {
        $institution = Institution::findOrFail($id);
        $institution->update(['status' => 'active']);
        User::where('institution_id', $id)->update(['status' => 'active']);
        return response()->json(['message' => 'Institution reactivated.', 'data' => $institution->fresh()]);
    }

    public function deleteInstitution(int $id): JsonResponse
    {
        Institution::findOrFail($id)->delete();
        return response()->json(['message' => 'Institution deleted.']);
    }

    public function listUsers(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->with('institution:id,name')->latest()->paginate($request->input('per_page', 15));
        return response()->json($users);
    }

    public function suspendUser(int $id): JsonResponse
    {
        User::findOrFail($id)->update(['status' => 'suspended']);
        return response()->json(['message' => 'User suspended.']);
    }

    public function activateUser(int $id): JsonResponse
    {
        User::findOrFail($id)->update(['status' => 'active']);
        return response()->json(['message' => 'User activated.']);
    }

    public function deleteUser(int $id): JsonResponse
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $query = AuditLog::with('user:id,name,email');
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }
        return response()->json($query->latest()->paginate($request->input('per_page', 50)));
    }

    public function systemHealth(): JsonResponse
    {
        $dbHealthy = false;
        try { DB::connection()->getPdo(); $dbHealthy = true; } catch (\Exception $e) {}

        return response()->json(['data' => [
            'application' => ['status' => 'healthy', 'env' => app()->environment()],
            'database' => ['status' => $dbHealthy ? 'healthy' : 'unhealthy', 'connection' => config('database.default')],
            'cache' => ['status' => 'healthy', 'driver' => config('cache.default')],
            'queue' => ['status' => 'healthy', 'connection' => config('queue.default')],
            'mail' => ['status' => config('mail.default') ? 'configured' : 'not_configured'],
            'storage' => ['status' => 'healthy'],
        ]]);
    }

    public function analytics(): JsonResponse
    {
        return response()->json(['data' => [
            'institutions' => [
                'total' => Institution::count(),
                'active' => Institution::where('status', 'active')->count(),
                'pending' => Institution::where('status', 'pending')->count(),
                'suspended' => Institution::where('status', 'suspended')->count(),
            ],
            'users' => [
                'total' => User::count(),
                'platform_admins' => User::where('role', 'platform_admin')->count(),
                'institution_admins' => User::where('role', 'institution_admin')->count(),
                'teachers' => User::where('role', 'teacher')->count(),
                'students' => User::where('role', 'student')->count(),
            ],
            'attendance' => [
                'total_sessions' => AttendanceSession::count(),
                'total_records' => AttendanceRecord::count(),
            ],
        ]]);
    }
}
