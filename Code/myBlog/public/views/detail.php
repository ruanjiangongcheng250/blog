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
				$resultComment = mysql_query("SELECT * FROM comment WHERE id = '".$_GET['id']."' order by time desc");
				while($row = mysql_fetch_array($resultComment))
				{
					array_push($arrComment,array('content'=> $row['content'],
												 'time'=> $row['time'],
												 'author'=> $row['author'],
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
										  'avator'=> $row['avator'],
										  'support'=> $row['support'],
										  'watch'=> $row['watch'],
										  'comment'=> $row['comment'],
										  'type'=> $row['type'],
										  'content'=> $row['content'],
										  'comment'=> $arrComment
										  ));
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
				mysql_close($conn);
?>
           