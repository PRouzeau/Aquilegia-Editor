<html>
 <head>
  <title>Test PHP</title>
 </head>
 <body>
 <form action="crypt.php" method="post">
  Password:<input type="text" name="password"><br>
 </form> 
 <?php 
	if (isset($_POST['password'])) {
		$cryptx = crypt($_POST['password'], 'hjh587jk');
		//$cryptx = password_hash($_POST['password']);
		echo "Password: ".$_POST['password']." Crypted password:".$cryptx; 
		echo "<br>".realpath("crypt.php");
	} 
 ?>
 </body>
</html>