<?php
    include 'base.php';
    $result = mysql_query("SELECT * FROM user WHERE id = '".$_GET['userId']."'");
    $likesResult = mysql_query("SELECT * FROM likes WHERE userId = '".$_GET['userId']."'");
    $fansResult = mysql_query("SELECT * FROM fans WHERE userId = '".$_GET['userId']."'");
    $fansArr = array();
    $likesArr = array();
    while($fansRow = mysql_fetch_array($fansResult)){
    	array_push($fansArr, $fansRow['fansId']);
    }
    while($likesRow = mysql_fetch_array($likesResult)){
    	array_push($likesArr, $likesRow['likesId']);
    }
    while($row = mysql_fetch_object($result)){
    	$article = mysql_query("SELECT * FROM article WHERE isPrivate = 0 AND author = '".$row->name."'"); //非私密文章
    	$note = mysql_query("SELECT * FROM article WHERE isPrivate = 1 AND author = '".$row->name."'"); //私密文章
		$articleArr = array();
		$noteArr = array();
    	$wordNumber = 0;
    	$getLikes = 0;
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
		while($noteRow = mysql_fetch_array($note)){
    		array_push($noteArr, array(
    		      'id'=> $noteRow['id'], 
				  'name'=> $noteRow['name'], 
				  'description'=> $noteRow['description'], 
				  'time'=> $noteRow['time'], 
				  'author'=> $noteRow['author'], 
				  'type'=> $noteRow['type'],
				  'wordNumber'=>$noteRow['wordNumber'],
				  'avator'=> $row->avator,
				  'comment'=> [],
				  'likes'=> []
    		));
    	}
    	for($x=0; $x<count($articleArr); $x++){
    		foreach($articleArr[$x] as $key=> $value){
    			if($key == 'wordNumber'){
    				$wordNumber += $value;
    			}
    			if($key == 'likes'){
    				$getLikes += count($value);
    			}
    		}
    	}
    	$arr = array(
    		'id' => $row->id,
	    	'avator' => $row->avator,
	    	'name'=> $row->name,
	    	'sex'=> $row->sex,
	    	'description'=> $row->description,
	    	'wechatImage'=> $row->wechatImage,
	    	'website'=> $row->website,
	    	'mobile'=> $row->mobile,
	    	'fans' => $fansArr,
	    	'likes' => $likesArr,
	    	'mail' => $row->mail,
	    	'wordNumber'=> $wordNumber,
	    	'getLikes'=> $getLikes,
			'articles' => $articleArr,
			'notes' => $noteArr
	    );
    }
    
    echo json_encode($arr);
?>