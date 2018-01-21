<?php
				include 'base.php';
				$userId = $_POST['userId'];
				$description = $_POST['description'];
				mysql_query("UPDATE `user` SET `description` = '$description' WHERE `user`.`id` = '$userId'");
				echo json_encode(array("code"=>200, "description"=>$description));
				mysql_close($conn);
?>