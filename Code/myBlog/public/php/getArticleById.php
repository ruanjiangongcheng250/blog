	<?php
				include 'base.php';
				$result = mysql_query("SELECT * FROM article WHERE id = '".$_GET['id']."'");
				$arr = array();
                while($row = mysql_fetch_array($result))
				{
					array_push($arr,array('id'=> $row['id'], 
										  'name'=> $row['name'], 
										  'description'=> $row['description'], 
										  'time'=> $row['time'], 
										  'author'=> $row['author'], 
										  'type'=> $row['type'],
										  'content'=> $row['content'],
										  'isPrivate'=> $row['isPrivate']
										  ));
				}  
				echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
				mysql_close($conn);
?>
           