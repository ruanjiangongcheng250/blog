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
				if($_GET['type']){
					if($_GET['keyword']){
						$result = mysql_query("SELECT * FROM article WHERE type = '".$_GET['type']."' and (name like '%".$_GET['keyword']."%' OR author like '%".$_GET['keyword']."%') ORDER BY time DESC");
					}else{
						$result = mysql_query("SELECT * FROM article WHERE type = '".$_GET['type']."' ORDER BY time DESC");
					}
				}else{
					if($_GET['keyword']){
						$result = mysql_query("SELECT * FROM article WHERE name like '%".$_GET['keyword']."%' OR author like '%".$_GET['keyword']."%' ORDER BY time DESC");
					}else{
						$result = mysql_query("SELECT * FROM article ORDER BY time DESC");
					}
				}
				$arr = array();
                while($row = mysql_fetch_array($result))
				{
					array_push($arr,array('id'=> $row['id'], 
										  'name'=> $row['name'], 
										  'description'=> $row['description'], 
										  'time'=> $row['time'], 
										  'author'=> $row['author'], 
//										  'avator'=> $row['avator'],
										  'support'=> $row['support'],
										  'watch'=> $row['watch'],
										  'comment'=> $row['comment'],
										  'type'=> $row['type']
										  ));
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
				mysql_close($conn);
?>
           