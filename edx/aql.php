<?php
// parameters of Aquilegia
ini_set('display_errors', 1);
error_reporting(E_ALL);

$fldir = "../h";
$filex = 'hlp';
$pagefile= "";

if (isset($_SERVER['PHP_AUTH_USER']))  // not valid for all php installations
	$author = $_SERVER['PHP_AUTH_USER'];
else // use what is defined in .htaccess
	$author = isset($_SERVER['REMOTE_USER'])?$_SERVER['REMOTE_USER']:"unknown";

function normPage ($hpage) {
	return strtolower(preg_replace ('/[\t ]/',"_",trim($hpage)));
}

function adb($a) {
	$fp = fopen("debug.txt", "a");
	fwrite ($fp,$a."\n",200);  
}

?>