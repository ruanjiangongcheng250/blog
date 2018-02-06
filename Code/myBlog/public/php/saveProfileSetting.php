<?php
	 include 'checkToken.php';
	 $id = $_POST['author_id'];
	 $wechatImage = $_POST['wechatImage'];
	 $description = $_POST['description'];
	 $website = $_POST['website'];
	 $sex = $_POST['sex'];
	 if($wechatImage){ //保存微信二维码
	 	mysql_query("UPDATE `user` SET `wechatImage` = '$wechatImage' WHERE `user`.`id` = '$id'");
		echo json_encode(array("code"=>200));
	 }else{//保存其他信息
		mysql_query("UPDATE `user` SET `description` = '$description', `website` = '$website', `sex` = '$sex'  WHERE `user`.`id` = '$id'");
		echo json_encode(array("code"=>200));
	    exit;
	 }
?>