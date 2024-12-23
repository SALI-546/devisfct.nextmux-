<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateProductsTableForPacks extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
        
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');

            $table->foreign('parent_id')->references('id')->on('products')->onDelete('cascade');

           
            $table->text('description')->nullable()->after('name');

            
            $table->integer('price_without_content')->nullable()->after('description');
            $table->integer('price_with_content')->nullable()->after('price_without_content');

            $table->dropColumn(['default_quantity', 'unit_price']);
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'description', 'price_without_content', 'price_with_content']);

            
            $table->integer('default_quantity')->default(1)->after('name');
            $table->decimal('unit_price', 15, 2)->after('default_quantity');
        });
    }
}
