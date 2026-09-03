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
        Schema::create('event_sponsors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('tier', ['platinum', 'gold', 'silver', 'bronze', 'media_partner', 'community_partner'])->default('gold');
            $table->string('logo')->nullable();
            $table->string('website_url')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_sponsors');
    }
};
