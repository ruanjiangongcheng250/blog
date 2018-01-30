<?php
				include 'checkToken.php';
				$author_id = $_POST['author_id'];
				$description = $_POST['description'];
				mysql_query("UPDATE `user` SET `description` = '$description' WHERE `user`.`id` = '$author_id'");
				echo json_encode(array("code"=>200, "description"=>$description));
				mysql_close($conn);
?>