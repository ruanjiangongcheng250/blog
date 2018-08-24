	<?php
				include 'base.php';
				$timeOrder = $_GET['timeOrder'];
				$result = mysql_query("SELECT * FROM article WHERE id = '".$_GET['id']."'");
				$arrComment = array();
				if(!empty($timeOrder) && $timeOrder == 1){
					$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$_GET['id']."' order by time asc");
				}else{
					$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$_GET['id']."' order by time desc");
				}
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
										  'wordNumber'=> $row['wordNumber'],
										  'isPrivate'=> $row['isPrivate'],
										  'comment'=> $arrComment,
										  'likes'=> $arrLikes
										  ));
					mysql_query("UPDATE `article` SET `watch` = ". ($row['watch'] + 1) ." where `id` =".$_GET['id']);
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
				mysql_close($conn);
?>
           