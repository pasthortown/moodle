<?php

function httpPost($url, $data=NULL, $headers = NULL, $token) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    if(!empty($data)){
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }
    $headersSend = array('Content-Type: application/json');
    array_push($headersSend, 'api_token:'.$token);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headersSend);
    $response = curl_exec($ch);
    if (curl_error($ch)) {
        trigger_error('Curl Error:' . curl_error($ch));
    }
    curl_close($ch);
    return $response;
}

$url = 'http://localhost:9095/template';

$backup_templates_file = fopen("./templates.json", "r") or die("Error al buscar el backup!");
$backup_templates_json = fread($backup_templates_file,filesize("./templates.json"));
fclose($backup_templates_file);
$backup_templates = json_decode($backup_templates_json);
foreach($backup_templates as $data) {
    $respuesta = httpPost($url, json_encode($data->Template), null, null);
}
echo "Plantillas Cargadas";
