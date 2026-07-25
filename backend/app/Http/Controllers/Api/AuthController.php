<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Registration failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->input('email'),
                $request->input('password'),
                $request->input('device_name', 'web')
            );
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'token' => $result['token'],
                ],
                'message' => 'Login successful.',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Login failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());
            return response()->json(['message' => 'Logged out successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Logout failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function user(Request $request): JsonResponse
    {
        try {
            $user = $this->authService->getUser($request->user());
            return response()->json(['success' => true, 'data' => $user]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch user.', 'error' => $e->getMessage()], 500);
        }
    }

    public function changePassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'current_password' => ['required', 'string'],
                'new_password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $this->authService->changePassword(
                $request->user(),
                $request->input('current_password'),
                $request->input('new_password')
            );

            return response()->json(['message' => 'Password changed successfully.']);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to change password.', 'error' => $e->getMessage()], 500);
        }
    }
}
