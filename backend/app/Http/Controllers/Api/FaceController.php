<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FaceEncoding;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaceController extends Controller
{
    public function enroll(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => ['required', 'exists:users,id'],
                'institution_id' => ['required', 'exists:institutions,id'],
                'images' => ['required', 'array', 'min:3', 'max:6'],
                'images.*' => ['required', 'string'], // base64 encoded images
                'poses' => ['required', 'array'],
                'poses.*' => ['required', 'string', 'in:front,left,right,blink,smile,random'],
            ]);

            $user = User::findOrFail($validated['user_id']);

            // In production, this would call the FastAPI AI service
            // For now, we mock the embedding generation
            $mockEmbedding = array_fill(0, 512, 0.0);

            $encoding = FaceEncoding::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'institution_id' => $validated['institution_id'],
                ],
                [
                    'encoding' => $mockEmbedding,
                    'poses' => $validated['poses'],
                    'image_count' => count($validated['images']),
                    'is_active' => true,
                    'enrolled_at' => now(),
                ]
            );

            return response()->json([
                'message' => 'Face enrolled successfully.',
                'encoding' => $encoding,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Face enrollment failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function verify(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => ['required', 'exists:users,id'],
                'image' => ['required', 'string'], // base64 encoded
            ]);

            $encoding = FaceEncoding::where('user_id', $validated['user_id'])
                ->where('is_active', true)
                ->first();

            if (!$encoding) {
                return response()->json(['message' => 'No face encoding found for user.'], 404);
            }

            // In production, this would call the FastAPI AI service
            // For now, return mock verification result
            return response()->json([
                'matched' => true,
                'confidence' => 0.95,
                'liveness_score' => 0.92,
                'liveness_passed' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Face verification failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function status(Request $request): JsonResponse
    {
        try {
            $userId = $request->input('user_id', $request->user()->id);
            $encoding = FaceEncoding::where('user_id', $userId)->first();

            return response()->json([
                'enrolled' => $encoding !== null,
                'is_active' => $encoding?->is_active ?? false,
                'enrolled_at' => $encoding?->enrolled_at,
                'poses' => $encoding?->poses ?? [],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to check face status.', 'error' => $e->getMessage()], 500);
        }
    }
}
