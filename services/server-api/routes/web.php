<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
   return 'Web Wervice Realizado con LSCodeGenerator';
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('enviar', ['uses' => 'MailerController@enviar']);
   $router->post('download/template', ['uses' => 'ExporterController@pdf_template']);

   //CRUD Template
   $router->post('/template', ['uses' => 'TemplateController@post']);
   $router->get('/template', ['uses' => 'TemplateController@get']);
   $router->get('/template/paginate', ['uses' => 'TemplateController@paginate']);
   $router->get('/template/backup', ['uses' => 'TemplateController@backup']);
   $router->put('/template', ['uses' => 'TemplateController@put']);
   $router->delete('/template', ['uses' => 'TemplateController@delete']);
   $router->post('/template/masive_load', ['uses' => 'TemplateController@masiveLoad']);
});

$router->group(['middleware' => ['auth']], function () use ($router) {

});
