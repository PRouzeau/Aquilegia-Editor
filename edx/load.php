<?php // Aquilegia editor (c) Pierre Rouzeau 2016 - GPL 2.0 or any later version
$text="";
$pfile="";
$sha1=""; 
$shapage="";
$textd="";

include 'aql.php'; 
include 'finediff.php';

if (isset($_POST['flname'])) {
	$pfile = normPage($_POST['flname']);
	$lng = strlen($pfile); 
	if ($lng>4 && substr ($pfile,$lng-4)==".txt")
		$pfile = substr ($pfile,$lng-4);
	$pagefile = $fldir."/".$pfile.".txt";
	$pgbak = "hist/".$pfile.".bak";
	if (file_exists ($pagefile)) {
		$text = file_get_contents($pagefile);
		$sha1 = sha1($text);
		if (sha1_file($pagefile)!=@sha1_file($pgbak)) { // check if file modified/bak file (external mod)
			$oldtext = @file_get_contents($pgbak);
			$oldtext = ($oldtext ? $oldtext : ""); //blank if file not accessible
			storeDiff($text, $oldtext, $pfile);
			copy ($pagefile, $pgbak);
		}
		$textd= str_replace("&", "&amp;", $text);		
		$res = "res:OK\nsha1:".$sha1."\ntext:".$textd."\n";
	}	
	else
		$res = "res:File ".$pagefile." not found\n"; 
	echo $res;
}

function storeDiff ($newtext, $oldtext) {
	global $author, $pfile;
	$filediff = "hist/".$pfile.".dif"; 
	$opcodes = FineDiff::getDiffOpcodes($newtext, $oldtext);	
	$delta = strlen($newtext)-strlen($oldtext); // [5]
	$rev = isset($_POST['revision']) ? $_POST['revision'] :"";	// [3]
	$headiff = strlen($opcodes).",".$author.",".date("j M Y-G:i").",".$rev.",".strlen($newtext).",".$delta.",".$_SERVER['REMOTE_ADDR']."\n";
	$fp = fopen($filediff, "a");
	fwrite ($fp,$headiff,strlen($headiff));  
	fwrite ($fp,$opcodes,strlen($opcodes)); // length fixed to stop magic quotes
}
?>