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
				//校验用户名，手机号，邮箱是否已经存在
				$result1 = mysql_query("SELECT * FROM user WHERE name ='".$name."'");
				$result2 = mysql_query("SELECT * FROM user WHERE mobile ='".$mobile."'");
				$result3 = mysql_query("SELECT * FROM user WHERE  mail ='".$mail."'");
				if(mysql_num_rows($result1)){
					echo json_encode(array("code"=>200, "message"=>"用户名已存在"));
				}else if(mysql_num_rows($result2)){
					echo json_encode(array("code"=>200, "message"=>"手机号已存在"));
				}else if(mysql_num_rows($result3)){
					echo json_encode(array("code"=>200, "message"=>"邮箱已存在"));
				}else{
					mysql_query("INSERT INTO `user`(`name`, `mobile`, `password`, `mail`) VALUES ('$name','$mobile','$password','$mail')");
					setcookie('name', $name);
					echo json_encode(array("code"=>200, "url"=>"index.html"));
				    exit;
				}
				mysql_close($conn);
?>