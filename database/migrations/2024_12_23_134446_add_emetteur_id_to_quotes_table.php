<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmetteurIdToQuotesTable extends Migration
{
      /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('quotes', function (Blueprint $table) {
          
            $table->unsignedBigInteger('emetteur_id')->nullable()->after('client_id');
        });

       
        Schema::table('quotes', function (Blueprint $table) {
            $table->foreign('emetteur_id')->references('id')->on('emetteurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropForeign(['emetteur_id']);
            $table->dropColumn('emetteur_id');
        });
    }
}
