<?php
	include 'base.php';
	$author_id = $_POST['author_id'];
	$token = $_POST['token'];
	$userResult = mysql_query("SELECT * FROM `user` WHERE id = '$author_id' AND token = '$token'");
	if(!mysql_num_rows($userResult)){
		echo json_encode(array("code"=>999, "message"=>'用户token不合法'));
		exit;
	}
?>