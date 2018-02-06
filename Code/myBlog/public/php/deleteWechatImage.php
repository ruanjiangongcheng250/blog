<?php
	include 'checkToken.php';
	mysql_query("UPDATE `user` SET `wechatImage` = '' WHERE `user`.`id` = ".$author_id);
	echo json_encode(array("code"=>200));
	mysql_close($conn);
?>
           