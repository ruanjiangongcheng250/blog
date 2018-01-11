<?php
		include 'base.php';
		$articleArr = explode(',', $_GET['articleArr']); 
		$arr = array();
		for($x=0; $x<count($articleArr); $x++){
			$result = mysql_query("SELECT * FROM article WHERE id = '".$articleArr[$x]."' ORDER BY time DESC");
	        while($row = mysql_fetch_array($result))
			{
				$user = mysql_query("SELECT * from user where name ='".$row['author']."'");
				while($row_user = mysql_fetch_object($user)){
					$avator = $row_user->avator;
					$arrComment = array();
		    		$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$articleArr[$x]."'");
		    		while($comment = mysql_fetch_array($resultComment)){
						array_push($arrComment,array('content'=> $comment['content'],
													 'time'=> $comment['time'],
													 'author'=> $comment['author'],
													 'author_avator'=> $comment['author_avator']
						                             ));
					}
					$arrLikes = array();
					$resultLikes = mysql_query("SELECT * FROM likesofarticle WHERE article_id = ".$articleArr[$x]);
					while($likes= mysql_fetch_array($resultLikes))
					{
						array_push($arrLikes,array('id'=> $likes['id'],
													 'author_id'=> $likes['author_id'],
													 'author_name'=> $likes['author_name']
						                             ));
					}
					array_push($arr,array('id'=> $row['id'], 
										  'name'=> $row['name'], 
										  'description'=> $row['description'], 
										  'time'=> $row['time'], 
										  'author'=> $row['author'], 
										  'support'=> $row['support'],
										  'watch'=> $row['watch'],
										  'type'=> $row['type'],
										  'avator'=> $avator,
										  'likes'=> $arrLikes,
										 'comment'=>$arrComment
										  ));
				}
			}  
    	}
		echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);  //以字面编码多字节 Unicode 字符，用空白字符格式化返回的数据
		mysql_close($conn);
?>