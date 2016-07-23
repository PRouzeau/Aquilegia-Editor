<?php
	$dir = "../h";
	$data = "";
	$pagelist = scandir($dir);
	sort ($pagelist);
	foreach ($pagelist as $page){
		if (substr ($page, strlen ($page)-4) == ".txt" && $page!="hlp.txt" && $page!="aqlpreview.txt" && $page!="imglist.txt")
			$data.= substr($page, 0, strlen ($page)-4)."\n"; 
	}
	echo $data;
?>