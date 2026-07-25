<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manual_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attendance_record_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewed_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->enum('decision', ['approved', 'rejected', 'resubmission'])->default('pending');
            $table->text('reason')->nullable();
            $table->text('teacher_notes')->nullable();
            $table->json('evidence')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'reviewed_by']);
            $table->index(['attendance_record_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manual_reviews');
    }
};

