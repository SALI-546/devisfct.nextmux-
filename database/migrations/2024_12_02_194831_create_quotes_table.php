<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotesTable extends Migration
{
    public function up()
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('numero')->unique();
            $table->date('date_emission');
            $table->string('logo_path')->nullable(); // Chemin du logo
            $table->boolean('include_tva')->default(false);
            $table->string('paiement')->default('NextmuxPay'); // Modes de paiement
            $table->text('commentaires')->nullable();
            $table->string('signature_path')->nullable(); // Chemin de la signature
            $table->enum('statut', ['En cours', 'Validé', 'Brouillon'])->default('En cours'); // Statut du devis
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotes');
    }
}
