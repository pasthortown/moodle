<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('templates', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->longText('body')->nullable($value = true);
          $table->string('title',1024)->nullable($value = true);
          $table->string('orientation',50)->nullable($value = true);
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('templates');
    }
}