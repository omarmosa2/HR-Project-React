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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('period'); // e.g., "2025-08" for August 2025
            $table->decimal('base_salary', 10, 2);
            $table->decimal('additions', 10, 2)->default(0); // bonuses, overtime, etc.
            $table->decimal('deductions', 10, 2)->default(0); // taxes, insurance, etc.
            $table->decimal('net_salary', 10, 2);
            $table->string('status')->default('pending'); // pending, processed, paid
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->unique(['employee_id', 'period']); // One payroll record per employee per period
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
