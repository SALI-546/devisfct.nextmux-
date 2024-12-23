<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('web_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('estimated_time');
            $table->string('estimated_cost');
            $table->string('start_mode');
            $table->json('files');
            $table->string('phone');
            $table->boolean('phone_visible')->default(1);
            $table->string('email');
            $table->boolean('email_visible')->default(1);
            $table->string('address')->nullable();
            $table->string('country');
            $table->string('prefix');
            $table->string('devise');
            $table->string('country_flag');
            $table->string('category');
            $table->json('skills');
            $table->text('requirements');
            $table->boolean('can_be_local')->default(1);
            $table->foreignId('user_id')->nullable()->constrained(); 
            $table->enum('status', ['pending', 'approved', 'rejected', 'taken', 'finished', 'in_progress', 'on_hold', 'cancelled', 'archived', 'under_review'])->default('pending');
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('web_projects');
    }
};
