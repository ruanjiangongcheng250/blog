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
