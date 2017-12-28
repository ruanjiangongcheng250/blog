if(location.search.indexOf('article_id') > -1){
	var article_id = location.search.substr(12);
	$('input[name=article_id]').val(article_id);
}
//验证码
$.idcode.setCode();

if(location.search.indexOf('registe') > -1){
	$('#login h4.registe').addClass('active');
	$('#login h4.login').removeClass('active');
	$('#registerContainer').removeClass('hide');
	$('#loginContainer').addClass('hide');
}
$('#login h4').on('click',function(){
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	if($(this).hasClass('login')){
		$('#registerContainer').addClass('hide');
		$('#loginContainer').removeClass('hide');
	}else{
		$('#registerContainer').removeClass('hide');
		$('#loginContainer').addClass('hide');
	}
});

//点击登录
$('#loginContainer #loginSubmit').on('click', function(){
	var commitData = {};
	commitData.name = $("#loginContainer #name").val();
	commitData.password = $("#loginContainer #password").val();
	commitData.article_id =$('input[name=article_id]').val();
	//验证非空
	if(!commitData.name){
		jAlert('请输入用户名');
		return;
	}
	if(!commitData.password){
		jAlert('请输入密码','提示');
		return;
	}
	if(!$('#validateCode').val()){
		jAlert('请输入验证码','提示');
		return;
	}
	//验证验证码
	if(!$.idcode.validateCode()){
		jAlert('验证码输入错误','提示');
		return;
	}
	$.ajax({
		type:"post",
		url:"login.php",
		async:true,
		data: commitData,
		success: function(result){
			if(result.code == '404'){
				jAlert('用户名或密码错误','提示');
				return;
			}
			location.href = result.url;
		}
	});
});

//点击注册
$('#registerContainer #registeSubmit').on('click', function(){
	var commitData = {};
	commitData.name = $("#registerContainer #name").val();
	commitData.password = $("#registerContainer #password").val();
	commitData.Confirmpassword = $("#registerContainer #Confirmpassword").val();
	commitData.mobile = $("#registerContainer #mobile").val();
	commitData.mail = $("#registerContainer #mail").val();
	//验证非空
	if(!commitData.name){
		jAlert('请输入用户名');
		return;
	}
	if(!commitData.password){
		jAlert('请输入密码','提示');
		return;
	}
	if(!commitData.Confirmpassword){
		jAlert('请输入确认密码','提示');
		return;
	}
	if(!commitData.mobile){
		jAlert('请输入手机号','提示');
		return;
	}
	if(!commitData.mail){
		jAlert('请输入邮箱','提示');
		return;
	}
	//验证密码与确认密码是否一致
	if(commitData.password != commitData.Confirmpassword){
		jAlert('密码与确认密码不一致','提示');
		return;
	}
	
	//验证邮箱
	var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
	if(!regEmail.test(commitData.mail)){
		jAlert('请输入正确的邮箱','提示');
		return;
	}
	
	//验证手机号
	var regMobile = /^1[3|5|7|8]\d{9}$/;
	if(!regMobile.test(commitData.mobile)){
		jAlert('请输入11位数有效手机号','提示');
		return;
	}
	delete commitData.Confirmpassword;
	//验证
	$.ajax({
		type:"post",
		url:"registe.php",
		async:true,
		data: commitData,
		success: function(result){
			if(result.message){
				jAlert(result.message,'提示');
				return;
			}else{
				location.href = result.url;
			}
		}
	});
});
//注册验证表单

