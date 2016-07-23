<?php
	$imgdir = "../h/d";
	$data = "";
	$imglist = array_diff(scandir($imgdir), array('..', '.', ''));
	sort ($imglist);
	foreach ($imglist as $value){
		$data.= $value."\n"; 
	}
	echo $data;
?>