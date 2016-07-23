<?
// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
$filename = '../h/'.$_POST['fname'];
// write the data out to the file
$fp = fopen($filename, 'wb');
$res = fwrite($fp, base64_decode($data));
fclose($fp);
if ($res)
	echo $filename.":OK";
else
	echo $filename.":Failed";
?>