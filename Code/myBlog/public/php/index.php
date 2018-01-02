	<?php
                include 'base.php';
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
										  'support'=> $row['support'],
										  'watch'=> $row['watch'],
										  'comment'=> $row['comment'],
										  'type'=> $row['type']
										  ));
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);  //以字面编码多字节 Unicode 字符，用空白字符格式化返回的数据
				mysql_close($conn);
?>
           