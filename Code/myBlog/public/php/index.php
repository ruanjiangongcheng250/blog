	<?php
                include 'base.php';
				if($_GET['type']){
					if($_GET['keyword']){
						$result = mysql_query("SELECT * FROM article WHERE isPrivate = 0 AND type = '".$_GET['type']."' and (name like '%".$_GET['keyword']."%' OR author like '%".$_GET['keyword']."%') ORDER BY time DESC");
					}else{
						$result = mysql_query("SELECT * FROM article WHERE isPrivate = 0 AND type = '".$_GET['type']."' ORDER BY time DESC");
					}
				}else{
					if($_GET['keyword']){
						$result = mysql_query("SELECT * FROM article WHERE isPrivate = 0 AND name like '%".$_GET['keyword']."%' OR author like '%".$_GET['keyword']."%' ORDER BY time DESC");
					}else{
						$result = mysql_query("SELECT * FROM article WHERE isPrivate = 0 ORDER BY time DESC");
					}
				}
				$arr = array();
                while($row = mysql_fetch_array($result))
				{
					$user = mysql_query("SELECT * from user where name ='".$row['author']."'");
					while($row_user = mysql_fetch_object($user)){
						$avator = $row_user->avator;
						$userId = $row_user->id;
						array_push($arr,array('id'=> $row['id'], 
											  'name'=> $row['name'], 
											  'description'=> $row['description'], 
											  'time'=> $row['time'], 
											  'author'=> $row['author'], 
											  'support'=> $row['support'],
											  'watch'=> $row['watch'],
											  'comment'=> $row['comment'],
											  'type'=> $row['type'],
											  'avator'=> $avator,
											  'userId'=> $userId
											  ));
					}
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);  //以字面编码多字节 Unicode 字符，用空白字符格式化返回的数据
				mysql_close($conn);
?>
           