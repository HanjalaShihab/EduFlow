<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->constrained()->nullOnDelete();
            $table->string('phone')->nullable();
            $table->string('student_id')->nullable();
            $table->string('institution_email')->nullable();
            $table->string('avatar')->nullable();
            $table->enum('role', ['platform_admin', 'institution_admin', 'teacher', 'student'])->default('student');
            $table->enum('status', ['pending', 'active', 'suspended', 'rejected'])->default('pending');
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('bio')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('program_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('semester_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('section_id')->nullable()->constrained()->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('face_enrolled_at')->nullable();
            $table->json('settings')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['program_id']);
            $table->dropForeign(['semester_id']);
            $table->dropForeign(['section_id']);
            $table->dropColumn([
                'institution_id', 'phone', 'student_id', 'institution_email',
                'avatar', 'role', 'status', 'gender', 'date_of_birth',
                'bio', 'address', 'department_id', 'program_id',
                'semester_id', 'section_id', 'rejection_reason',
                'approved_at', 'face_enrolled_at', 'settings'
            ]);
        });
    }
};

