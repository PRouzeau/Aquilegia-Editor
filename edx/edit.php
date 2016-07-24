<!-- Aquilegia editor (c) Pierre ROUZEAU - License: GPLV2 or any later version - CC BY-SA 3.0 -->
<html lang="en">
<head>
<meta charset="utf-8">
<link href="edit.css" rel="stylesheet"> 
<!-- markItUp! skin -->
<link rel="stylesheet" type="text/css" href="markitup/skins/style.css">
<!--  markItUp! toolbar skin -->
<link rel="stylesheet" type="text/css" href="markitup/sets/style.css">
<script type="text/javascript" src="../js/jquery-2.2.1.min.js"></script>
<!-- markItUp! -->
<script type="text/javascript" src="markitup/jquery.markitup.js"></script>
<!-- markItUp! toolbar settings -->
<script type="text/javascript" src="markitup/sets/set.js"></script>

<title>Aquilegia edition</title>
</head>
<body>
<?php
define('CR', "\r");        
define('LF', "\n");      
define('CRLF', "\r\n");
$text="";
$pfile="";
$sha1=""; 
$shapage="";
$warn="";
$textd="";
$demo = false;
$demotxt = "";
$warnedit = "
<div id='warn_edit'>
    <div class='title'>There was a concurrent edition.</div>
	Your edition was not saved.<br>
	You can force saving and supersede concurrent edition, but please have a look at history page before doing so.<br>
	Both editions will be visible in the history<br>
	<input type='button' value='force save of this edition' id='btnYesForce' onclick=\"forceSave()\" />
	<input type='button' value='abort' id='btnAbortForce' onclick=\"this.parentNode.style.display = 'none'\" /> 
</div>";

include 'aql.php'; 
include 'finediff.php';

if (isset($_SERVER['PHP_AUTH_USER']))  // not valid for all php installations
	$author = $_SERVER['PHP_AUTH_USER'];
else // use what is defined in .htaccess
	$author = isset($_SERVER['REMOTE_USER'])?$_SERVER['REMOTE_USER']:"unknown";

if (isset($_POST['flname'])) {
	$pfile = normPage($_POST['flname']);
	$lng = strlen($pfile); 
	if ($lng>4 && substr ($pfile,$lng-4)==".txt")
		$pfile = substr ($pfile,$lng-4);
	$pagefile = $fldir."/".$pfile.".txt";
	$pgbak = "hist/".$pfile.".bak";
	if (isset($_POST['submit']) && $_POST['submit']=="Load")
		if (file_exists ($pagefile)) {
			$text = file_get_contents($pagefile);
			$sha1 = sha1($text);
			if (sha1_file($pagefile)!=@sha1_file($pgbak)) { // check if file modified/bak file (external mod)
				$oldtext = @file_get_contents($pgbak);
				$oldtext = ($oldtext ? $oldtext : ""); //blank if file not accessible
				storeDiff($text, $oldtext, $pfile);
				copy ($pagefile, $pgbak);
			}
		}	
		else
			$text = "File ".$pagefile." not found"; // not the best idea 
		$textd= str_replace("&", "&amp;", $text);	
}

// check if form has been submitted
if ($pfile && isset($_POST['texta']) && isset($_POST['submit']) && $_POST['submit']=="Save page") { // save the text contents
	$text = str_replace(CRLF, LF,$_POST['texta']);
    $text = str_replace(CR, LF, $text);
	$textd= str_replace("&", "&amp;", $text); //escape '&' to avoid Textarea crush html entities->will return naked '&' 
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
					file_put_contents($pagefile, $text);
					copy ($pagefile, $pgbak);
				}
				else 
					$demotxt = "\n\nYou CANNOT save page in the demonstration\n\n\n";
			} else
				$warn= $warnedit; // do not save in case of concurrent edition and not forced save
		}
	}	
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
<!-- HTML form -->
<form name = "myform" method="post">
File name:<input id="fileinp" type="text" name="flname" value="<?=$pfile?>">
<input id="btnload" type="submit" name="submit" value="Load"> 
&nbsp; Go to page:<input type="text" name="gopage"><input id="gpg" type="submit" name="gpg" value="GO">
<a href="history.php?hpage=<?=$pfile?>"><button type="button">History</button></a>
<a href="dragdrop.htm" target ="_blank"><button type="button">upLoad images</button></a>
 Author: <?=$author?><br>
<!--?php echo "sha1:".$_POST['sha1']." submit: ".$_POST['submit']." force save: ".$_POST['forcesave']; ?-->
<textarea name="texta" id="texta" class="panecontainer"><?=$demotxt.$textd?></textarea>
Revision: <input id="revision" type="text" name="revision">
<input id="svp" type="submit" name="submit" value="Save page"/>
<input type="reset" value="Reset"/>
<input type="hidden" name="sha1" value="<?=$sha1?>"/>
<input type="hidden" name="forcesave" value="no save"/> <!--modified by JS--> 
</form>
<div id="pglist" class="pgx"></div> 
<div id="imglist" class="pgx"></div> 
<div id="imgtip" class="imgx"></div> 
<div id='modal_dialog'>
    <div class='title'></div>
    <input type='button' value='yes' id='btnYes' />
    <input type='button' value='no' id='btnNo' />
	<input type='button' value='abort' id='btnAbort' />
</div>
<?=$warn?>
<script src="edit.js"></script>
</body>
</html>