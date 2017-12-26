	<?php
				header("Content-Type:text/json;charset=UTF-8");
				$dbhost = 'localhost:3306';  // mysql服务器主机地址
				$dbuser = 'root';            // mysql用户名
				$dbpass = '';          // mysql用户名密码
				$conn = mysql_connect($dbhost, $dbuser, $dbpass);
				mysql_query("set character set 'utf8'");//读库
				mysql_query("set names 'utf8'");//写库 
				if(!$conn)
				{
					die('Could not connect: ' . mysql_error());
				}
				mysql_select_db("blog", $conn);
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
           