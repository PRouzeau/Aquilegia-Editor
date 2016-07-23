<?php
//error_reporting(E_ALL);
//var_dump($_SERVER);
include 'aql.php'; 

$post_data = $_POST['key'];
if (!empty($post_data)) {
	if (strlen($post_data) < 1000000)
		$res = file_put_contents($fldir.'/aqlpreview.txt',$post_data);
	echo $res;
}
?>