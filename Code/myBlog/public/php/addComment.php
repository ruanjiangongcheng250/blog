	<?php
				include 'checkToken.php';
				$id = $_POST['id'];
				$time = $_POST['time'];
				$content = $_POST['content'];
				$author = $_POST['author'];
				$author_avator = $_POST['author_avator'];
				$currentNumAdd =  $_POST['currentNum'] + 1;
				$result = mysql_query("INSERT INTO `comment`(`article_id`, `content`, `author`, `author_avator`, `time`) VALUES ('$id','$content','$author','$author_avator','$time')");
				mysql_query("UPDATE `article` SET `comment` = '$currentNumAdd' WHERE `article`.`id` = '$id';");
				echo json_encode(array("code"=>200));
				mysql_close($conn);
?>
           