<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('room')->nullable();
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->integer('attendance_window_minutes')->default(15);
            $table->enum('status', ['scheduled', 'active', 'paused', 'completed', 'cancelled'])->default('scheduled');
            $table->enum('type', ['in_person', 'online', 'hybrid'])->default('in_person');
            $table->json('settings')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['institution_id', 'teacher_id']);
            $table->index(['institution_id', 'course_id', 'section_id']);
            $table->index(['status', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};

