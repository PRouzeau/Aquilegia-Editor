<html lang="en">
<head>
<meta charset="utf-8">
<link href="edit.css" rel="stylesheet"> 
<title>Aquilegia edition history</title>
</head>
<body>
<?php
include 'aql.php'; 
include 'finediff.php';

$pfile ="hlp";
if (isset($_GET['hpage'])) 
	$pfile = $_GET['hpage'];
$lnks = getTabDiff ($pfile); 
	
function getTabDiff ($pfile) {
	global $fldir;
	$diff=""; $hdiff=[]; $opc=[]; $oph=[]; $nbdiff=0; $i=0;
	$pgfile = $fldir."/".$pfile.".txt";
	$filediff = "hist/".$pfile.".dif";
	$fp = fopen($filediff, "r");
	while (($buffer = fgets($fp)) !== false) {
		$hdiff [$i] =$buffer;
        $oph[$i] = explode(",",$hdiff [$i]);
		$opc[$i] = fread($fp, intval($oph[$i][0]));
		$i++;
    }
	$nbdiff=$i-1;
	$links ="";
	for ($i=$nbdiff; $i>=0; $i--) {
		$lnk="diff.php?hpage=".$pfile."&pos=".$i;
		$htext = $oph[$i][1].",".$oph[$i][2]." size:".$oph[$i][4].",add:".$oph[$i][5].",change:".$oph[$i][0]." Bytes Rev:".$oph[$i][3];
		$links .= "<a href='".$lnk."'>Diff</a> ".$htext."<br>";
	} 
	return $links;
}
?>
<h1> <?php echo $pfile ?> page history</h1>
<div><?php echo $lnks ?></div>
</body>
</html>
