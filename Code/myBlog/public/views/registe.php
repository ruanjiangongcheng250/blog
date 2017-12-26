<?php
				header("Content-Type:text/json;charset=UTF-8");
				$dbhost = 'localhost:3306';  // mysql服务器主机地址
				$dbuser = 'root';            // mysql用户名
				$dbpass = '';          // mysql用户名密码
				$conn = mysql_connect($dbhost, $dbuser, $dbpass);
				mysql_query("set character set 'utf8'");//读库
				mysql_query("set names 'utf8'");//写库 
				if(! $conn )
				{
					die('Could not connect: ' . mysql_error());
				}
				mysql_select_db("blog", $conn);
				$name = $_POST['name'];
				$password = $_POST['password'];
				$mail = $_POST['mail'];
				$mobile = $_POST['mobile'];
				$result = mysql_query("INSERT INTO `user`(`name`, `mobile`, `password`, `mail`) VALUES ('$name','$mobile','$password','$mail')");
				setcookie('name', $name);
				//echo json_encode(array("code"=>200));
				mysql_close($conn);
				header("Location: index.html?name=".$name); 
				exit;
?>