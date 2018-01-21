<?php
	echo $_SERVER['HTTP_USER_AGENT'];
	echo '<br>';
	if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) { //strpos(string,find,start)  返回字符串在另一字符串中第一次出现的位置，如果没有找到字符串则返回 FALSE。(注释：字符串位置从 0 开始，不是从 1 开始。)
	   echo '正在使用 Internet Explorer。<br />';
	}else{
	   echo '正在使用其他浏览器。<br />';
	}
	
	$bool = TRUE;
	$str = "foo";
	$int = 12;
	
	echo gettype($bool);
	echo '<br>';
	echo gettype($str);
	echo '<br>';
	echo gettype($int);
	echo '<br>';
	if(is_int($int)){
		echo "$int is a int <br>";
		echo "\$int is a int <br>";
	}
	if(is_string($str)){
		echo "$str is a string <br>";
		echo "\$str is a string <br>";
	}
	if(is_bool($bool)){
		echo "$bool is a bool <br>";
		echo "\$bool is a bool <br>";
	}
	
	echo (int) ( (0.1+0.7) * 10 );  //决不要将未知的分数强制转换为 integer，这样有时会导致意外的结果。
	echo '<br>';
	echo ( (0.1+0.7) * 10 );
	echo '<br>';
	
	$beer = 'Heineken';
	echo "$beer's taste is great"; // works, "'" is an invalid character for varnames
	echo '<br>';
	echo "He drank some $beers";   // won't work, 's' is a valid character for varnames
	echo '<br>';
	echo "He drank some ${beer}s"; // works
	echo '<br>';
	echo "He drank some {$beer}s"; // works
	echo '<br>';
	$arr = array("name"=>'zhangsan',"age"=>12);
	echo json_encode($arr);
	echo '<br>';
	echo var_dump($arr);
    echo '<br>';
	$obj1 = (object)$arr;
	echo $obj1->name;
	echo '<br>';
	echo $obj1->age;
	echo '<br>';
    $obj = (object)'zackon';
    echo $obj->scalar;
    echo '<br>';
	echo phpinfo();
?>