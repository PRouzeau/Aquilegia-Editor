<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="edit.css" rel="stylesheet"> 
<script type="text/javascript" src="../js/jquery-2.2.1.min.js"></script>
<title>Aquilegia page diff</title> <!--page derived from demo of finediff by Raymond Hill.  MIT license-->
</head>
<body>
<?php
include 'aql.php';
include 'finediff.php';

$granularity = 3; // character granularity
$diff_opcodes = '';
$diff_opcodes_len = 0;
$start_time = gettimeofday(true);

function getOneDiff ($pfile, $pos) {
	global $fldir;
	$hdiff=[]; $opc=[]; $oph=[]; $i=0; $res =[];
	$pgfile = $fldir."/".$pfile.".txt";
	$prev = file_get_contents($pgfile);
	$filediff = "hist/".$pfile.".dif";
	$fp = fopen($filediff, "r");
	while (($buffer = fgets($fp)) !== false) {
		$hdiff [$i] =$buffer;
        $oph[$i] = explode(",",$hdiff [$i]);
		$opc[$i] = fread($fp, intval($oph[$i][0]));
		$i++;
    }
	$nbdiff=$i-1;
	for ($i=$nbdiff; $i>=$pos; $i--) {
		$to = $prev;
		$prev = FineDiff::renderToTextFromOpcodes($to, $opc[$i]);	
	} 
	$res[0] = $to;
	$res[1] = $prev;
	$res[2] = $nbdiff ? $oph[$nbdiff-1] : ["","","","","","",""];
	return $res;
}
	
	$pfile = $_GET['hpage'];
	$difpos = $_GET['pos'];
	
	$OneDiff = getOneDiff ($pfile, $difpos);
	$to_text = $OneDiff [0];
	$from_text = $OneDiff [1];
	$tbi = $OneDiff [2];
	$pres = $pfile." page history; auth:"; // title
	$pres .= $tbi[1].",".$tbi[2]." Size:".$tbi[4].",add:".$tbi[5].",change:".$tbi[0]." Bytes";
/*	if ( isset($_POST['granularity']) && ctype_digit($_POST['granularity']) ) {
		$granularity = max(min(intval($_POST['granularity']),3),0);
	} */
	/* limit input size
	$from_text = substr($from_text, 0, 1024*100);
	$to_text = substr($to_text, 0, 1024*100); */
	
	// ensure input is suitable for diff
	$from_text = mb_convert_encoding($from_text, 'HTML-ENTITIES', 'UTF-8');
	$to_text = mb_convert_encoding($to_text, 'HTML-ENTITIES', 'UTF-8');

	$granularityStacks = array(
		FineDiff::$paragraphGranularity,
		FineDiff::$sentenceGranularity,
		FineDiff::$wordGranularity,
		FineDiff::$characterGranularity
	);
	$diff_opcodes = FineDiff::getDiffOpcodes($from_text, $to_text, $granularityStacks[$granularity]);
	$diff_opcodes_len = strlen($diff_opcodes);
	$exec_time = gettimeofday(true) - $start_time;

$rendered_diff = FineDiff::renderDiffToHTMLFromOpcodes($from_text, $diff_opcodes);
//$rendered_diff = mb_convert_encoding($rendered_diff, 'UTF-8', 'HTML-ENTITIES');
//The library escape many chars to Html entities for proper display, escaping html markup, no automatic linking, etc.
//Another solution is to use a readonly html textarea
$from_len = strlen($from_text);
$to_len = strlen($to_text);
?>
<h1><?php echo $pres; ?></h1>
<div class="panecontainer" style="width:99%">
Show: <input type="radio" name="htmldiffshow" onclick="setHTMLDiffVisibility('deletions');">
Deletions only&ensp;<input type="radio" name="htmldiffshow" checked="checked" onclick="setHTMLDiffVisibility();">
All&ensp;<input type="radio" name="htmldiffshow" onclick="setHTMLDiffVisibility('insertions');">Insertions only
&nbsp;  - Revision: <?php echo $tbi[3]; ?>
<div id="htmldiff" class="pane" style="white-space:pre-wrap"><?php echo $rendered_diff; ?></div>
</div>
<form>
<div class="panecontainer" style="display:inline-block;width:49.5%"><p>From</p>
<div><textarea name="from" class="pane" readonly><?php echo $from_text; ?></textarea></div></div>
<div class="panecontainer" style="display:inline-block;width:49.5%" readonly><p>To</p>
<div><textarea name="to" class="pane"><?php echo $to_text; ?></textarea></div></div>
</form>
<div style="position:fixed; top:0; left:618px;">
<input type="button" value='&dArr;' onclick ='nextChange()' style='font-size:25px;'/>
<input type="button" value='&uArr;' onclick ='prevChange()' style='font-size:25px;'/></div>
<script>
function setHTMLDiffVisibility(what) {
	var htmldiffEl = document.getElementById('htmldiff'), 
		className = htmldiffEl.className;
	className = className.replace(/\bonly(Insertions|Deletions)\b/g, '').replace(/\s{2,}/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '');
	if ( what === 'deletions' ) {
		htmldiffEl.className = className + ' onlyDeletions';
	}
	else if ( what === 'insertions' ) {
		htmldiffEl.className = className + ' onlyInsertions';
	}
	else {
		htmldiffEl.className = className;
	}
}

$("#htmldiff del").addClass ("xfind");
$("#htmldiff ins").addClass ("xfind");
var tabSearch = $(".xfind");
var idx=0;

function nextChange() {
	if (idx < tabSearch.length) {
		var pos1 = tabSearch.eq(idx).offset().top -50;
		$('html, body').animate({
			scrollTop: pos1
		}, 2000);
		var lastPos = pos1;
		while (idx < tabSearch.length &&((pos1 = tabSearch.eq(idx).offset().top) < (lastPos+200)))
			idx++;
	}
}
function prevChange() {
	if (idx > 1) {
		var lastPos = tabSearch.eq(idx-1).offset().top -50;
		while (idx >2  &&((pos1 = tabSearch.eq(idx-1).offset().top) > (lastPos-200)))
			idx--;
		var pos1 = tabSearch.eq(idx-2).offset().top -50;
		$('html, body').animate({
			scrollTop: pos1
		}, 2000);
	}
}

</script>
</body>
</html>
