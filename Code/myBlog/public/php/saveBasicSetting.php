<?php
	 include 'base.php';
	 $id = $_POST['id'];
	 $avator = $_POST['avator'];
	 if($avator){
	 	mysql_query("UPDATE `user` SET `avator` = '$avator' WHERE `user`.`id` = '$id'");
		echo json_encode(array("code"=>200));
	 }
?>