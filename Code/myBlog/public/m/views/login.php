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
				$name = $_POST['name'];
				$password = $_POST['password'];
				$article_id = $_POST['article_id'];
				
				$result = mysql_query("SELECT * FROM `user` WHERE (name = '$name' OR mobile='$name' OR mail='$name') AND password = '$password'");
				while($row = mysql_fetch_object($result)){
					$author_avator = $row->avator;
					$author_id = $row->id;
				}
				if(mysql_num_rows($result)){
					setcookie('name', $name);
					setcookie('avator', $author_avator);
					setcookie('author_id', $author_id);
					$resultOfLikes = mysql_query("SELECT * FROM `likesofarticle` WHERE author_id='$author_id'");
					$arrLikes = array();
					while($row = mysql_fetch_array($resultOfLikes)){
					    array_push($arrLikes, $row['article_id']);
					}
					setcookie('likesofarticle', implode(',',$arrLikes));
					if(empty($article_id)){
						echo json_encode(array("code"=>200,"url"=>"index.html"),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
					}else{
						echo json_encode(array("code"=>200,"url"=>"detail.html?id=".$article_id),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
					}
				}else{
					echo json_encode(array("code"=>404,"url"=>"login.html"),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
				}
				mysql_close($conn);
				
?>