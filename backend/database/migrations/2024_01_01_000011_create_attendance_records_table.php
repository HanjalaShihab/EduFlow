<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attendance_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('attendance_keyword_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['present', 'late', 'absent', 'excused', 'pending_review', 'rejected'])->default('present');
            $table->float('face_confidence')->nullable();
            $table->float('liveness_score')->nullable();
            $table->boolean('liveness_passed')->default(false);
            $table->boolean('face_matched')->default(false);
            $table->boolean('keyword_matched')->default(false);
            $table->string('captured_image')->nullable();
            $table->string('liveness_video')->nullable();
            $table->json('ai_response')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('marked_at');
            $table->timestamps();

            $table->unique(['attendance_session_id', 'student_id']);
            $table->index(['institution_id', 'status']);
            $table->index(['student_id', 'marked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};

