<?php
				include 'base.php';
				setcookie('name','',time()-3600,'/');
				setcookie('author_id','',time()-3600,'/');
				setcookie('avator','',time()-3600,'/');
				setcookie('likesofarticle','',time()-3600,'/');
				setcookie('token','',time()-3600,'/');
				echo json_encode(array("code"=>200));
				
?>