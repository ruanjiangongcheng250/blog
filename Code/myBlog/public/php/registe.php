<?php
				include 'base.php';
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
					$token = rand().rand().rand();
					setcookie('token', $token,time()+36000,'/');
					mysql_query("INSERT INTO `user`(`name`, `mobile`, `password`, `mail`, `token`) VALUES ('$name','$mobile','$password','$mail','$token')");
					$result = mysql_query("SELECT * FROM user WHERE name ='".$name."'");
					while($row = mysql_fetch_object($result)){
						setcookie('author_id', $row->id, time()+3600, '/');
					}
					setcookie('name', $name, time()+3600, '/');
					echo json_encode(array("code"=>200, "url"=>"index.html"));
				    exit;
				}
				mysql_close($conn);
?>