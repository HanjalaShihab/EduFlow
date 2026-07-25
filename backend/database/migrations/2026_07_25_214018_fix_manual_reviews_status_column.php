<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manual_reviews', function (Blueprint $table) {
            $table->dropColumn('decision');
        });

        Schema::table('manual_reviews', function (Blueprint $table) {
            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'resubmission'
            ])->default('pending');
        });
    }

    public function down(): void
    {
        Schema::table('manual_reviews', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('manual_reviews', function (Blueprint $table) {
            $table->enum('decision', [
                'approved',
                'rejected',
                'resubmission'
            ])->default('pending');
        });
    }
};