<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Template;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TemplateController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Template::get(),200);
       } else {
          $template = Template::findOrFail($id);
          $attach = [];
          return response()->json(["Template"=>$template, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Template::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $template = new Template();
          $lastTemplate = Template::orderBy('id')->get()->last();
          if($lastTemplate) {
             $template->id = $lastTemplate->id + 1;
          } else {
             $template->id = 1;
          }
          $template->body = $result['body'];
          $template->title = $result['title'];
          $template->orientation = $result['orientation'];
          $template->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($template,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $template = Template::where('id',$result['id'])->update([
             'body'=>$result['body'],
             'title'=>$result['title'],
             'orientation'=>$result['orientation'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($template,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Template::destroy($id);
    }

    function backup(Request $data)
    {
       $templates = Template::get();
       $toReturn = [];
       foreach( $templates as $template) {
          $attach = [];
          array_push($toReturn, ["Template"=>$template, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['Template'];
         $exist = Template::where('id',$result['id'])->first();
         if ($exist) {
           Template::where('id', $result['id'])->update([
             'body'=>$result['body'],
             'title'=>$result['title'],
             'orientation'=>$result['orientation'],
           ]);
         } else {
          $template = new Template();
          $template->id = $result['id'];
          $template->body = $result['body'];
          $template->title = $result['title'];
          $template->orientation = $result['orientation'];
          $template->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}