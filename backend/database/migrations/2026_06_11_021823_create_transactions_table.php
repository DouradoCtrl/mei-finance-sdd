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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('transaction_date');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->string('source');
            $table->string('classification')->default('pending');
            $table->string('fit_id')->nullable();
            $table->timestamps();

            // Índices
            $table->unique(['user_id', 'fit_id']);
            $table->index(['user_id', 'transaction_date', 'description', 'amount'], 'idx_user_trans_fallback');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
