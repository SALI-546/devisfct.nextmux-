<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentMethodsTable extends Migration
{
    public function up()
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Exemples : NextmuxPay, Stripe, PayPal
            $table->timestamps();
        });

        // Optionnel : Ajouter une clé étrangère dans la table quotes si vous souhaitez référencer payment_methods
        // Schema::table('quotes', function (Blueprint $table) {
        //     $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->onDelete('set null');
        // });
    }

    public function down()
    {
        // Optionnel : Supprimer la clé étrangère dans la table quotes si ajoutée
        // Schema::table('quotes', function (Blueprint $table) {
        //     $table->dropForeign(['payment_method_id']);
        //     $table->dropColumn('payment_method_id');
        // });

        Schema::dropIfExists('payment_methods');
    }
}
