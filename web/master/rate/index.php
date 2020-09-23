<?php

$url = 'https://api.exchangerate-api.com/v4/latest/USD'; 
$response = file_get_contents($url);
$someArray = json_decode($response, true);
$usd = $someArray['rates']['ARS'];       

$url = 'https://api.exchangerate-api.com/v4/latest/EUR'; 
$response = file_get_contents($url);
$someArray = json_decode($response, true);
$eur = $someArray['rates']['ARS'];       

if($response !== false){
	$data = array('USD' => $usd , 'EUR' => $eur);
	echo json_encode($data);	
}

?>
