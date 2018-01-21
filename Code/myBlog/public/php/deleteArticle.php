	<?php
				include 'base.php';
				$id = $_POST['id'];
				mysql_query("DELETE FROM `article` WHERE `article`.`id` =".$id);
				echo json_encode(array("code"=>200));
				mysql_close($conn);
?>
           