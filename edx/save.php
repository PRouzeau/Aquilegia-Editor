<?php  // Aquilegia editor (c) Pierre Rouzeau 2016 - GPL 2.0 or any later version
define('CR', "\r");        
define('LF', "\n");      
define('CRLF', "\r\n");
$text="";
$pfile="";
$sha1=""; 
$shapage="";
$textd="";
$demo = false;
$demotxt = "";

include 'aql.php'; 
include 'finediff.php';

if (isset($_POST['flname'])) {
	$pfile = normPage($_POST['flname']);
	$lng = strlen($pfile); 
	if ($lng>4 && substr ($pfile,$lng-4)==".txt")
		$pfile = substr ($pfile,$lng-4);
	$pagefile = $fldir."/".$pfile.".txt";
	$pgbak = "hist/".$pfile.".bak";
}

$rev = isset($_POST['revision']) ? $_POST['revision'] :"";	// [3]

$res = "res:File ".$pagefile." not saved"; 

if ($pfile && isset($_POST['texta'])) { // save the text contents
	$text = str_replace(CRLF, LF,$_POST['texta']);
    $text = str_replace(CR, LF, $text);
	$text = str_replace("&amp;","&", $text); //mmm not all browser behave similarly with html entities ? 
	if (trim($text)!= "") {
		$oldtext = @file_get_contents($pagefile);
		$oldtext = ($oldtext ? $oldtext : ""); //blank if file not accessible
		$shaold = sha1($oldtext);
		if (sha1($text)!=$shaold) { // there is really a modification
			if (isset($_POST['sha1'])) $shapage = $_POST['sha1'];
			if ($shapage==$shaold || ($oldtext=="") || (isset($_POST['forcesave']) && $_POST['forcesave']=="force save"))  { 
				$sha1 = sha1($text); // the file is saved, so this is a new $sha1
				if (!$demo) {
					storeDiff ($text, $oldtext);
					$sav = file_put_contents($pagefile, $text);
					if ($sav) {
						copy ($pagefile, $pgbak);
						$res = "res:OK\nsha1:".$sha1;
						recChanges();
					}
				}
				else {
					$res = "res:You CANNOT save page in the demonstration\n";
				}	
			} 
			else {
				$res = "res:concurrent\n"; // do not save in case of concurrent edition and not forced save
			}	
		}
		else 
			$res = "res:unchanged\n";
	} 
	else 
		$res = "res:empty text\n";
	echo $res; 
	buildlist();
}

function storeDiff ($newtext, $oldtext) {
	global $author, $pfile, $rev; // $author defined in aql.php
	$filediff = "hist/".$pfile.".dif"; 
	$opcodes = FineDiff::getDiffOpcodes($newtext, $oldtext);	
	$delta = strlen($newtext)-strlen($oldtext); // [5]
	$headiff = strlen($opcodes).",".$author.",".date("j M Y-G:i").",".$rev.",".strlen($newtext).",".$delta.",".$_SERVER['REMOTE_ADDR']."\n";
	$fp = fopen($filediff, "a");
	fwrite ($fp,$headiff,strlen($headiff));  
	fwrite ($fp,$opcodes,strlen($opcodes)); // length fixed to stop magic quotes
}

function recChanges () {
	global $author, $pfile, $rev;
	$change = date("j M Y-G:i").";".$author.":".$pfile.$rev."\n";
	$filech = "hist/changes.txt"; 
	$fp = fopen($filech, "a");
	fwrite ($fp,$change);  
}	

function buildlist() {
	global $fldir;
	$data = "";
	$pagelist = scandir($fldir);
	$pageexcl = ["hlp.txt","aqlpreview.txt","imglist.txt","pagelist.txt","aquilegia_syntax.txt"];
	sort ($pagelist);
	foreach ($pagelist as $page){
		if (substr ($page, strlen ($page)-4) == ".txt" && !in_array($page, $pageexcl))
			$data.= substr($page, 0, strlen ($page)-4)."\n"; 
	}
	return file_put_contents($fldir.'/pagelist.txt',$data);
}
?>