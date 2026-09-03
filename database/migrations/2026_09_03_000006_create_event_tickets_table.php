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
        Schema::create('event_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['free', 'paid'])->default('paid');
            $table->enum('tier', ['early_bird', 'regular', 'vip', 'group_package', 'custom'])->default('regular');
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('quantity')->default(100);
            $table->integer('quantity_sold')->default(0);
            $table->integer('min_per_transaction')->default(1);
            $table->integer('max_per_transaction')->default(5);
            $table->dateTime('sale_start_date')->nullable();
            $table->dateTime('sale_end_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'paused', 'sold_out'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_tickets');
    }
};
