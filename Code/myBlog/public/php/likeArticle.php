	<?php
				include 'checkToken.php';
				$article_id = $_POST['article_id'];
				$author_name = $_POST['author_name'];
				$like = $_POST['like'];
				$currentNumAdd = $_POST['number'] + 1;
				$currentNumMin = $_POST['number'] - 1;
				if($like == 'true'){
					$result = mysql_query("INSERT INTO `likesofarticle`(`article_id`, `author_id`, `author_name`) VALUES ('$article_id','$author_id','$author_name')");
					mysql_query("UPDATE `article` SET `support` = '$currentNumAdd' WHERE `article`.`id` = '$article_id';");
				}else{
					$result = mysql_query("DELETE FROM `likesofarticle` WHERE `likesofarticle`.`author_id` = '$author_id' and `likesofarticle`.`article_id` = '$article_id'");
					mysql_query("UPDATE `article` SET `support` = '$currentNumMin' WHERE `article`.`id` = '$article_id';");
				}
				echo json_encode(array("code"=>200));
				mysql_close($conn);
?>
           