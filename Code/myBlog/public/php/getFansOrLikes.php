	<?php
				include 'base.php';
				$userId = $_GET['userId'];
				$type = $_GET['type'];
				if($type == 'likes'){
					$likesAarr = array();
					$likesResult = mysql_query("SELECT * FROM likes WHERE userId = ".$userId);
					while($likesRow = mysql_fetch_array($likesResult)){
						$likesId = $likesRow['likesId'];
						$userResult = mysql_query("SELECT * from user where id ='".$likesId."'");
						$likesResult1 = mysql_query("SELECT * FROM likes WHERE userId = '".$likesId."'");
					    $fansResult = mysql_query("SELECT * FROM fans WHERE userId = '".$likesId."'");
					    $fansArr = array();
					    $likesArr = array();
					    while($fansRow = mysql_fetch_array($fansResult)){
					    	array_push($fansArr, $fansRow['fansId']);
					    }
					    while($likesRow = mysql_fetch_array($likesResult1)){
					    	array_push($likesArr, $likesRow['likesId']);
					    }
						while($row = mysql_fetch_object($userResult)){
					    	$article = mysql_query("SELECT * FROM article WHERE author = '".$row->name."'");
					    	$articleArr = array();
					    	$wordNumber = 0;
					    	while($articleRow = mysql_fetch_array($article)){
					    		$arrComment = array();
					    		$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$articleRow['id']."'");
					    		while($comment = mysql_fetch_array($resultComment)){
									array_push($arrComment,array('content'=> $comment['content'],
																 'time'=> $comment['time'],
																 'author'=> $comment['author'],
																 'author_avator'=> $comment['author_avator']
									                             ));
								}
								$arrLikes = array();
								$resultLikes = mysql_query("SELECT * FROM likesofarticle WHERE article_id = ".$articleRow['id']);
								while($likes= mysql_fetch_array($resultLikes))
								{
									array_push($arrLikes,array('id'=> $likes['id'],
																 'author_id'=> $likes['author_id'],
																 'author_name'=> $likes['author_name']
									                             ));
								}
					    		array_push($articleArr, array(
					    		      'id'=> $articleRow['id'], 
									  'name'=> $articleRow['name'], 
									  'description'=> $articleRow['description'], 
									  'time'=> $articleRow['time'], 
									  'author'=> $articleRow['author'], 
									  'watch'=> $articleRow['watch'],
									  'type'=> $articleRow['type'],
									  'wordNumber'=>$articleRow['wordNumber'],
									  'avator'=> $row->avator,
									  'comment'=>$arrComment,
									  'likes'=> $arrLikes
					    		));
					    	}
					    	for($x=0; $x<count($articleArr); $x++){
					    		foreach($articleArr[$x] as $key=> $value){
					    			if($key == 'wordNumber'){
					    				$wordNumber += $value;
					    			}
					    		}
					    	}
					    	$arr = array(
					    		'id' => $row->id,
						    	'avator' => $row->avator,
						    	'name'=> $row->name,
						    	'sex'=> $row->sex,
						    	'description'=> $row->description,
						    	'fans' => $fansArr,
						    	'likes' => $likesArr,
						    	'mail' => $row->mail,
						    	'wordNumber'=> $wordNumber,
						    	'articles' => $articleArr
						    );
					    }
						array_push($likesAarr,$arr);
					}
					echo json_encode($likesAarr);
				}else{
					$fanAarr = array();
					$fansResult = mysql_query("SELECT * FROM fans WHERE userId = ".$userId);
					while($fanssRow = mysql_fetch_array($fansResult)){
						$fansId = $fanssRow['fansId'];
						$userResult = mysql_query("SELECT * from user where id ='".$fansId."'");
						$likesResult = mysql_query("SELECT * FROM likes WHERE userId = '".$fansId."'");
					    $fansResult1 = mysql_query("SELECT * FROM fans WHERE userId = '".$fansId."'");
					    $fansArr = array();
					    $likesArr = array();
					    while($fansRow = mysql_fetch_array($fansResult1)){
					    	array_push($fansArr, $fansRow['fansId']);
					    }
					    while($likesRow = mysql_fetch_array($likesResult)){
					    	array_push($likesArr, $likesRow['likesId']);
					    }
						while($row = mysql_fetch_object($userResult)){
					    	$article = mysql_query("SELECT * FROM article WHERE author = '".$row->name."'");
					    	$articleArr = array();
					    	$wordNumber = 0;
					    	while($articleRow = mysql_fetch_array($article)){
					    		$arrComment = array();
					    		$resultComment = mysql_query("SELECT * FROM comment WHERE article_id = '".$articleRow['id']."'");
					    		while($comment = mysql_fetch_array($resultComment)){
									array_push($arrComment,array('content'=> $comment['content'],
																 'time'=> $comment['time'],
																 'author'=> $comment['author'],
																 'author_avator'=> $comment['author_avator']
									                             ));
								}
								$arrLikes = array();
								$resultLikes = mysql_query("SELECT * FROM likesofarticle WHERE article_id = ".$articleRow['id']);
								while($likes= mysql_fetch_array($resultLikes))
								{
									array_push($arrLikes,array('id'=> $likes['id'],
																 'author_id'=> $likes['author_id'],
																 'author_name'=> $likes['author_name']
									                             ));
								}
					    		array_push($articleArr, array(
					    		      'id'=> $articleRow['id'], 
									  'name'=> $articleRow['name'], 
									  'description'=> $articleRow['description'], 
									  'time'=> $articleRow['time'], 
									  'author'=> $articleRow['author'], 
									  'watch'=> $articleRow['watch'],
									  'type'=> $articleRow['type'],
									  'wordNumber'=>$articleRow['wordNumber'],
									  'avator'=> $row->avator,
									  'comment'=>$arrComment,
									  'likes'=> $arrLikes
					    		));
					    	}
					    	for($x=0; $x<count($articleArr); $x++){
					    		foreach($articleArr[$x] as $key=> $value){
					    			if($key == 'wordNumber'){
					    				$wordNumber += $value;
					    			}
					    		}
					    	}
					    	$arr = array(
					    		'id' => $row->id,
						    	'avator' => $row->avator,
						    	'name'=> $row->name,
						    	'sex'=> $row->sex,
						    	'description'=> $row->description,
						    	'fans' => $fansArr,
						    	'likes' => $likesArr,
						    	'mail' => $row->mail,
						    	'wordNumber'=> $wordNumber,
						    	'articles' => $articleArr
						    );
					    }
						array_push($fanAarr,$arr);
					}
					echo json_encode($fanAarr);
				}
				mysql_close($conn);
?>
           