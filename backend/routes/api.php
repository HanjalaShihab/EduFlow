<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SuperAdminController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\FaceController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Institution registration
Route::post('/institutions/register', [InstitutionController::class, 'register']);

// Public data endpoints for registration
Route::prefix('institutions')->group(function () {
    Route::get('/search', [InstitutionController::class, 'search']);
    Route::get('/{id}/departments', [InstitutionController::class, 'departments']);
    Route::get('/{id}/programs', [InstitutionController::class, 'programs']);
    Route::get('/{id}/semesters', [InstitutionController::class, 'semesters']);
    Route::get('/{id}/sections', [InstitutionController::class, 'sections']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    // Platform Admin (Super Admin) routes
    Route::middleware('role:platform_admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [SuperAdminController::class, 'dashboardStats']);
        Route::get('/dashboard/charts', [SuperAdminController::class, 'dashboardCharts']);
        Route::get('/dashboard/activities', [SuperAdminController::class, 'recentActivities']);

        // Institution Management
        Route::get('/institutions', [SuperAdminController::class, 'listInstitutions']);
        Route::get('/institutions/pending', [SuperAdminController::class, 'pendingRegistrations']);
        Route::get('/institutions/{id}', [SuperAdminController::class, 'getInstitution']);
        Route::put('/institutions/{id}', [SuperAdminController::class, 'updateInstitution']);
        Route::post('/institutions/{id}/approve', [SuperAdminController::class, 'approveInstitution']);
        Route::post('/institutions/{id}/reject', [SuperAdminController::class, 'rejectInstitution']);
        Route::post('/institutions/{id}/suspend', [SuperAdminController::class, 'suspendInstitution']);
        Route::post('/institutions/{id}/reactivate', [SuperAdminController::class, 'reactivateInstitution']);
        Route::delete('/institutions/{id}', [SuperAdminController::class, 'deleteInstitution']);
        Route::get('/institutions/{id}/stats', [SuperAdminController::class, 'institutionStats']);

        // User Management
        Route::get('/users', [SuperAdminController::class, 'listUsers']);
        Route::get('/users/{id}', [SuperAdminController::class, 'getUser']);
        Route::post('/users/{id}/suspend', [SuperAdminController::class, 'suspendUser']);
        Route::post('/users/{id}/activate', [SuperAdminController::class, 'activateUser']);
        Route::delete('/users/{id}', [SuperAdminController::class, 'deleteUser']);

        // Audit Logs
        Route::get('/audit-logs', [SuperAdminController::class, 'auditLogs']);

        // System Health
        Route::get('/system-health', [SuperAdminController::class, 'systemHealth']);

        // Platform Analytics
        Route::get('/analytics', [SuperAdminController::class, 'analytics']);
    });

    // Institution routes
    Route::middleware('role:institution_admin,platform_admin')->prefix('institutions')->group(function () {
        Route::get('/{id}', [InstitutionController::class, 'show']);
        Route::get('/{id}/dashboard', [InstitutionController::class, 'dashboard']);
        Route::get('/{id}/onboarding', [InstitutionController::class, 'onboardingProgress']);
    });

    // Face routes
    Route::prefix('face')->group(function () {
        Route::post('/enroll', [FaceController::class, 'enroll']);
        Route::post('/verify', [FaceController::class, 'verify']);
        Route::get('/status', [FaceController::class, 'status']);
    });

    // Attendance routes
    Route::prefix('attendance')->group(function () {
        // Teacher routes
        Route::middleware('role:teacher,institution_admin')->group(function () {
            Route::post('/sessions', [AttendanceController::class, 'createSession']);
            Route::post('/sessions/{sessionId}/keyword', [AttendanceController::class, 'generateKeyword']);
            Route::post('/sessions/{sessionId}/end', [AttendanceController::class, 'endSession']);
            Route::post('/records/{recordId}/review', [AttendanceController::class, 'reviewAttendance']);
            Route::get('/sessions/teacher/{teacherId}', [AttendanceController::class, 'teacherSessions']);
            Route::get('/pending-reviews', [AttendanceController::class, 'pendingReviews']);
        });

        // Student routes
        Route::middleware('role:student')->group(function () {
            Route::post('/sessions/{sessionId}/mark', [AttendanceController::class, 'markAttendance']);
            Route::get('/history/{studentId}', [AttendanceController::class, 'studentHistory']);
        });

        // Common routes
        Route::get('/active-sessions', [AttendanceController::class, 'activeSessions']);
        Route::get('/sessions/{sessionId}', [AttendanceController::class, 'getSession']);
    });

    // Student management routes
    Route::middleware('role:institution_admin')->prefix('students')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::get('/{id}', [StudentController::class, 'show']);
        Route::post('/{id}/approve', [StudentController::class, 'approve']);
        Route::post('/{id}/reject', [StudentController::class, 'reject']);
        Route::get('/pending', [StudentController::class, 'pending']);
    });

    // Teacher management routes
    Route::middleware('role:institution_admin')->prefix('teachers')->group(function () {
        Route::get('/', [TeacherController::class, 'index']);
        Route::post('/', [TeacherController::class, 'store']);
        Route::get('/{id}', [TeacherController::class, 'show']);
    });

    // Report routes
    Route::middleware('role:institution_admin,teacher')->prefix('reports')->group(function () {
        Route::get('/daily', [ReportController::class, 'daily']);
        Route::get('/weekly', [ReportController::class, 'weekly']);
        Route::get('/monthly', [ReportController::class, 'monthly']);
        Route::get('/student/{studentId}', [ReportController::class, 'byStudent']);
        Route::get('/course/{courseId}', [ReportController::class, 'byCourse']);
        Route::get('/export/pdf', [ReportController::class, 'exportPdf']);
        Route::get('/export/excel', [ReportController::class, 'exportExcel']);
    });
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
    ]);
});
