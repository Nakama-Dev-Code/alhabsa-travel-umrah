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
        Schema::create('package_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->onDelete('cascade');
            $table->foreignId('hotel_makkah_id')->constrained('hotels');
            $table->foreignId('hotel_madinah_id')->constrained('hotels');
            $table->foreignId('airport_id')->constrained('airports');
            $table->foreignId('airline_id')->constrained('airlines');
            $table->date('departure_date');
            $table->decimal('price', 15, 2);
            $table->integer('seat_available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_schedules');
    }
};
