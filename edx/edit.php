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
if (isset($_SERVER['PHP_AUTH_USER']))  // not valid for all php installations
	$author = $_SERVER['PHP_AUTH_USER'];
else // use what is defined in .htaccess
	$author = isset($_SERVER['REMOTE_USER'])?$_SERVER['REMOTE_USER']:"unknown";
?>
<!-- HTML form -->
<form name = "myform" method="post">
File name:<input id="fileinp" type="text" name="flname" value="">
<input type="button" id="btnload" value="Load" onclick="loadPage(event)">
&nbsp; Go to page:<input type="text" name="gopage"><input id="gpg" type="submit" name="gpg" value="GO">
<input type="button" value="History" onclick="history()">
<a href="dragdrop.htm" target ="_blank"><button type="button">upLoad images</button></a>
 Author: <?=$author?><br>
<textarea name="texta" id="texta" class="panecontainer"></textarea>
Revision: <input id="revision" type="text" name="revision">
<!-- <input id="svp" type="submit" name="submit" value="Save page"/> -->
<input type="button" id="svp" value="Save page" onclick="savePage(event)">
<input type="reset" value="Reset"/>
<div id="msgresult" style="display:inline"></div>
<input type="hidden" name="sha1" value=""/>
<input type="hidden" name="forcesave" value="no save"/> <!--modified by JS--> 
</form>
<div id="pgsuggest" class="pgx"></div> 
<div id="pglist" class="pgx"></div> 
<div id="imglist" class="pgx"></div> 
<div id="imgtip" class="imgx"></div> 
<div id='modal_dialog'>
    <div class='title'></div>
    <input type='button' value='yes' id='btnYes' />
    <input type='button' value='no' id='btnNo' />
	<input type='button' value='abort' id='btnAbort' />
</div>
<div id='warn_edit'>
    <div class='title'>There was a concurrent edition.</div>
	Your edition was not saved.<br>
	You can force saving and supersede concurrent edition, but please have a look at history page before doing so.<br>
	Both editions will be visible in the history<br>
	<input type='button' value='force save of this edition' id='btnYesForce' onclick="forceSave()" />
	<input type='button' value='abort' id='btnAbortForce' onclick="this.parentNode.style.display = 'none'" /> 
</div>
<script src="edit.js"></script>
</body>
</html>