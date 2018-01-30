	<?php
				include 'checkToken.php';
				$userId = $_POST['author_id'];
				$addLikesId = $_POST['addLikesId'];
				$addLikeType = $_POST['addLikeType'];
				if($addLikeType == 'true'){
					$result = mysql_query("INSERT INTO `likes`(`userId`, `likesId`) VALUES ('$userId','$addLikesId')");
					$result = mysql_query("INSERT INTO `fans`(`userId`, `fansId`) VALUES ('$addLikesId','$userId')");
				}else{
					$result = mysql_query("DELETE FROM `likes` WHERE `likes`.`userId` = '$userId' and `likes`.`likesId` = '$addLikesId'");
					$result = mysql_query("DELETE FROM `fans` WHERE `fans`.`userId` = '$addLikesId' and `fans`.`fansId` = '$userId'");
				}
				echo json_encode(array("code"=>200));
				mysql_close($conn);
?>
           