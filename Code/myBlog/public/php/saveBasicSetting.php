<?php
	 include 'checkToken.php';
	 $id = $_POST['author_id'];
	 $avator = $_POST['avator'];
	 $mobile = $_POST['mobile'];
	 $email = $_POST['email'];
	 $name = $_POST['name'];
	 if($avator){ //保存头像
	 	mysql_query("UPDATE `user` SET `avator` = '$avator' WHERE `user`.`id` = '$id'");
		echo json_encode(array("code"=>200));
	 }else{//保存其他信息
		//校验用户名，手机号，邮箱是否已经存在
		$result1 = mysql_query("SELECT * FROM user WHERE name ='".$name."' and id !=".$id);
		$result2 = mysql_query("SELECT * FROM user WHERE mobile ='".$mobile."' and id !=".$id);
		$result3 = mysql_query("SELECT * FROM user WHERE  mail ='".$email."' and id !=".$id);
		if(mysql_num_rows($result1)){
			echo json_encode(array("code"=>999, "message"=>"用户名已存在"));
		}else if(mysql_num_rows($result3)){
			echo json_encode(array("code"=>999, "message"=>"邮箱已存在"));
		}else if(mysql_num_rows($result2)){
			echo json_encode(array("code"=>999, "message"=>"手机号已存在"));
		}else{
			mysql_query("UPDATE `user` SET `name` = '$name', `mobile` = '$mobile', `mail` = '$email'  WHERE `user`.`id` = '$id'");
			setcookie('name', $name, time()+3600, '/');
			echo json_encode(array("code"=>200));
		    exit;
		}
	 }
?>