<?php
include 'aql.php'; 
	$pageexcl = ["hlp.txt","aqlpreview.txt","pagelist.txt","aquilegia_syntax.txt"];
	$data = "";
	$pagelist = scandir($fldir);
	sort ($pagelist);
	foreach ($pagelist as $page){
		if (substr ($page, strlen ($page)-4) == ".txt" && !in_array($page, $pageexcl))
			$data.= substr($page, 0, strlen ($page)-4)."\n"; 
	}
	echo $data;
?>