<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('emetteur_id')->nullable()->after('client_id'); // Or after another suitable column
            $table->foreign('emetteur_id')->references('id')->on('emetteurs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['emetteur_id']);
            $table->dropColumn('emetteur_id');
        });
    }
};