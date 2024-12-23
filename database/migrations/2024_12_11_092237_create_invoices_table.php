<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('quote_id')->nullable()->constrained()->onDelete('set null');
            $table->string('numero')->unique();
            $table->date('date_emission');
            $table->boolean('include_tva')->default(false);
            $table->string('paiement')->default('NextmuxPay');
            $table->text('commentaires')->nullable();
            $table->string('signature_path')->nullable();
            $table->enum('statut', ['Brouillon','Envoyée','Payée','Partiellement Payée','Annulée'])->default('Brouillon');
            $table->string('public_token', 100)->unique()->nullable();
            $table->date('due_date')->nullable(); // Date d’échéance si nécessaire
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
