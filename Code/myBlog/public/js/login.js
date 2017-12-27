if(location.search.indexOf('article_id') > -1){
	var article_id = location.search.substr(12);
	$('input[name=article_id]').val(article_id);
}
if(location.search.indexOf('registe') > -1){
	$('#login h4.registe').addClass('active');
	$('#login h4.login').removeClass('active');
	$('#registerContainer').show();
	$('#loginContainer').hide();
}
$('#login h4').on('click',function(){
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	if($(this).hasClass('login')){
		$('#registerContainer').hide();
		$('#loginContainer').show();
	}else{
		$('#registerContainer').show();
		$('#loginContainer').hide();
	}
});

//注册验证表单

