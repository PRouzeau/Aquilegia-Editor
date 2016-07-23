<?php
include 'aql.php'; 
@copy ($fldir."/imglist.txt", $fldir."/imglist.bak");
$text = @file_get_contents($fldir."/imglist.txt");
if(!$text)
	$text = "This file contains metadata of all images displayed by Aquilegia\n".
	"Manual updates are not modified by utilities\ndefault.png\ndefault image parameters\n".
	"auth:unknown, shortdesc:topic, longdesc:topic detailed, licence:CC BY-SA";

$tablines = preg_split("/[\n,]+/", $text);
$tabimg=array();
$idx=0;
$intro="";

foreach ($tablines as $el) {
	$el = trim ($el);
	if (is_aqlimg ($el)) {
		$idx++; 
		$tabimg[$idx] = array($el,"");
	}	
	else 
		addel ($el);
}

$count = count ($tabimg);
img_list_dir($fldir."/d"); // add files as needed
$count = count ($tabimg)-$count;

$newtext = $intro."\n";
foreach ($tabimg as $img) {
	$cont = (xx(@$img[1])) ? $img[1]."\n":"";
	$newtext .= xx(@$img[0])."\n".$cont."\n";	
}	

$res= @file_put_contents($fldir."/imglist.txt", $newtext);
if ($res) 
	echo "Image metadata list 'imglist.txt' updated\n".$count." entries added";	
else 
	echo "Problem to update the image metadata list 'imglist.txt'";	

function xx($el) {
	return empty($el)? "" : $el;
}

function is_aqlimg ($el) {
	$lng = strlen($el); 
	if ($lng>4) {
		$ext = strtolower (substr($el,$lng-4));
		return ($ext==".png"||$ext==".jpg"||$ext==".svg"); 
	}
	else 
		return false;
}

function addel($el) {
	global $tabimg, $idx, $intro;
	if ($el) 
		if ($idx>0) {
			if ((strlen($tabimg[$idx][1])+strlen($el))>80)
				$sep = "\n";
			else 
				$sep =", ";
			if ($tabimg[$idx][1]=="") $sep= "";
			return $tabimg[$idx][1].=$sep.$el;
		}
		else	
			$intro.=$el."\n";
}

function img_exists($name) {
	global $tabimg;
	foreach ($tabimg as $img) 
		if ($img[0]==$name) 
			return true;
	return false;		
}

function img_list_dir($dir) {
	global $tabimg, $idx;
	$flist = array_diff(scandir($dir), array('..', '.'));
	foreach ($flist as $fname) {
		if (is_dir($fname)) {
			img_list_dir($dir."/".$fname);
		}
		else if (is_aqlimg($fname) && !img_exists($fname)) {
			$idx++; 
			$tabimg[$idx] = array ($fname, "");
		}
	}			
} 
?>