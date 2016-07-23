<?php
// parameters of Aquilegia
ini_set('display_errors', 1);
error_reporting(E_ALL);

$fldir = "../h";
$filex = 'hlp';
$pagefile= $fldir."/hlp.txt";

function normPage ($hpage) {
	return strtolower(preg_replace ('/[\t ]/',"_",trim($hpage)));
}

function adb($a) {
	$fp = fopen("debug.txt", "a");
	fwrite ($fp,$a."\n",200);  
}

?>