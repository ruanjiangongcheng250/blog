<?php
				include 'checkToken.php';
				$id = $_POST['id'];
				$name = $_POST['name'];
				$time = $_POST['time'];
				$author = $_POST['author'];
				$type = $_POST['type'];
				$description = $_POST['description'];
				$content = $_POST['content'];
				$wordNumber = $_POST['wordNumber'];
				$isPrivate = $_POST['isPrivate'];
				if(empty($id)){ //新增
					mysql_query("INSERT INTO `article`(`name`, `author`, `description`,`content`,`type`, `time`, `wordNumber`, `isPrivate`) VALUES ('$name','$author','$description','$content','$type', '$time', '$wordNumber', '$isPrivate')");
					echo json_encode(array("code"=>200));
				}else{ //修改
					mysql_query("UPDATE `article` SET `name` = '$name', `type` = '$type', `description` = '$description', `time` = '$time', `content` = '$content', `wordNumber` = '$wordNumber', `isPrivate` = '$isPrivate' WHERE `article`.`id` = '$id'");
					echo json_encode(array("code"=>200));
				}
				mysql_close($conn);
?>