<?php

namespace App\Http\Controllers;

use Validator;
Use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailerController extends Controller
{
  public function enviar(Request $data) {
    $result = $data->json()->all();
    $tipoMail = $result['tipoMail'];
    $email = $result['email'];
    $subject = $result['subject'];
    $information = $result['information'];
    return $this->send_mail($email, $information, $subject, env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'), $tipoMail);
  }

  protected function send_mail($to, $information, $subject, $fromMail, $fromAlias, $tipoMail) {
    $information_processed = $information;
    $data = ['name'=>$information_processed['para'], 'information'=>$information_processed, 'appName'=>env('MAIL_FROM_NAME')];
    try {
      $response = Mail::send($tipoMail, $data, function($message) use ($to, $subject, $fromMail, $fromAlias, $information_processed, $tipoMail) {
        $message->to($to, $information_processed['para'])->subject($subject);
        $message->from($fromMail,$fromAlias);
        if ($tipoMail == 'adjunto') {
            $message->attachData(base64_decode($information_processed['pdfBase64']), 'Certificado.pdf', ['mime' => 'application/pdf']);
        }
      });
      return response()->json('Success!!',200);
    } catch (Exception $e) {
      return response()->json($e->getMessage(),400);
    }

  }
}
