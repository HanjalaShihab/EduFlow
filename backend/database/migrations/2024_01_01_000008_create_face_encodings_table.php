<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('face_encodings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->text('encoding_encrypted');
            $table->string('image_path');
            $table->enum('pose', ['front', 'left', 'right', 'blink', 'smile', 'random'])->default('front');
            $table->float('confidence')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_primary']);
            $table->index(['institution_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('face_encodings');
    }
};

