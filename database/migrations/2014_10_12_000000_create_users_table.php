<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nm_id')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password'); // Ajout de la colonne 'password'
            $table->boolean('is_confirmed')->default(false);
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_desabled')->default(false);
            $table->boolean('have_complete')->default(false);
            $table->boolean('is_online')->nullable();
            $table->string('fcm_token')->nullable();
            $table->string('double_auth_code')->nullable();  
            $table->enum('devise', ['XOF','USD','EUR'])->default('XOF');  
            $table->boolean('double_auth_code_confirmed')->default(true);  
            $table->dateTime('last_connexion')->nullable();
            $table->rememberToken(); // Ajout de la colonne 'remember_token'
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
