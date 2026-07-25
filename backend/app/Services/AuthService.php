<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'pending';
        $data['role'] = $data['role'] ?? 'student';

        $user = $this->userRepository->create($data);
        $token = $user->createToken('registration')->plainTextToken;

        return [
            'message' => 'Registration successful. Please wait for approval.',
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(string $email, string $password, string $deviceName = 'web'): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is not active. Please contact your institution administrator.'],
            ]);
        }

        $token = $user->createToken($deviceName)->plainTextToken;

        return [
            'user' => $user->load('institution'),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function logoutAllDevices(User $user): void
    {
        $user->tokens()->delete();
    }

    public function getUser(User $user): User
    {
        return $user->load(['institution', 'department', 'program', 'semester', 'section']);
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}
