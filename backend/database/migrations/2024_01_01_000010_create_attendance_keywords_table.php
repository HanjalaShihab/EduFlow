<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('keyword_hash');
            $table->string('keyword_display')->nullable();
            $table->enum('type', ['manual', 'auto_generated'])->default('auto_generated');
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['attendance_session_id', 'is_active']);
            $table->index(['institution_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_keywords');
    }
};

