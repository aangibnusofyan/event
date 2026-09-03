<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->string('banner_image')->nullable();
            $table->enum('event_type', ['online', 'offline', 'hybrid'])->default('offline');
            $table->enum('status', ['draft', 'published', 'ended', 'cancelled'])->default('draft');
            $table->dateTime('start_date_time');
            $table->dateTime('end_date_time');
            $table->string('timezone')->default('Asia/Jakarta');

            // Online specific fields
            $table->string('online_platform')->nullable();
            $table->text('streaming_link')->nullable();
            $table->text('streaming_instructions')->nullable();

            // Offline specific fields
            $table->string('venue_name')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('google_maps_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
