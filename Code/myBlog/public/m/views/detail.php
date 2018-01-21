	<?php
				header("Content-Type:text/json;charset=UTF-8");
				$dbhost = 'localhost:3306';  // mysql服务器主机地址
				$dbuser = 'root';            // mysql用户名
				$dbpass = '';          // mysql用户名密码
				$conn = mysql_connect($dbhost, $dbuser, $dbpass);
				mysql_query("set character set 'utf8'");//读库
				mysql_query("set names 'utf8'");//写库 
				if(! $conn )
				{
					die('Could not connect: ' . mysql_error());
				}
				mysql_select_db("blog", $conn);
				$result = mysql_query("SELECT * FROM article WHERE id = '".$_GET['id']."'");
				$arrComment = array();
				$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$_GET['id']."' order by time desc");
				while($row = mysql_fetch_array($resultComment))
				{
					array_push($arrComment,array('content'=> $row['content'],
												 'time'=> $row['time'],
												 'author'=> $row['author'],
												 'author_avator'=> $row['author_avator']
					                             ));
				}
				$arrLikes = array();
				$resultLikes = mysql_query("SELECT * FROM likesofarticle WHERE article_id = ".$_GET['id']);
				while($row = mysql_fetch_array($resultLikes))
				{
					array_push($arrLikes,array('id'=> $row['id'],
												 'author_id'=> $row['author_id'],
												 'author_name'=> $row['author_name']
					                             ));
				}
				$arr = array();
                while($row = mysql_fetch_array($result))
				{
					array_push($arr,array('id'=> $row['id'], 
										  'name'=> $row['name'], 
										  'description'=> $row['description'], 
										  'time'=> $row['time'], 
										  'author'=> $row['author'], 
										  'watch'=> $row['watch'],
										  'type'=> $row['type'],
										  'content'=> $row['content'],
										  'comment'=> $arrComment,
										  'likes'=> $arrLikes
										  ));
					mysql_query("UPDATE `article` SET `watch` = ". ($row['watch'] + 1) ." where `id` =".$_GET['id']);
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
				mysql_close($conn);
?>
           