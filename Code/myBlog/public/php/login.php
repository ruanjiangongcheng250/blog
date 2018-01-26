<?php
				include 'base.php';
				$name = $_POST['name'];
				$password = $_POST['password'];
				$article_id = $_POST['article_id'];
				$user_id = $_POST['user_id'];
				$result = mysql_query("SELECT * FROM `user` WHERE (name = '$name' OR mobile='$name' OR mail='$name') AND password = '$password'");
				while($row = mysql_fetch_object($result)){
					$author_avator = $row->avator;
					$author_id = $row->id;
				}
				if(mysql_num_rows($result)){
					setcookie('name', $name,time()+36000,'/');
					setcookie('avator', $author_avator,time()+36000,'/');
					setcookie('author_id', $author_id,time()+36000,'/');
					$resultOfLikes = mysql_query("SELECT * FROM `likesofarticle` WHERE author_id='$author_id'");
					$arrLikes = array();
					while($row = mysql_fetch_array($resultOfLikes)){
					    array_push($arrLikes, $row['article_id']);
					}
					setcookie('likesofarticle', implode(',',$arrLikes),time()+36000,'/');
					if(!empty($article_id)){
						echo json_encode(array("code"=>200,"url"=>"detail.html?id=".$article_id),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
					}else if(!empty($user_id)){
						echo json_encode(array("code"=>200,"url"=>"user.html?user_id=".$user_id),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
					}else{
						echo json_encode(array("code"=>200,"url"=>"index.html"),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
					}
				}else{
					echo json_encode(array("code"=>404,"url"=>"login.html"),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
				}
				mysql_close($conn);
				
?>