$(function(){
	var user_id = location.search.substr(9);
	   
	//操作cookie的方法
	CookieParser = {
	    setCookie: function (name, value, expireDays) {
	        if (expireDays == null) expireDays = 30;
	        var exp = new Date();
	        exp.setTime(exp.getTime() + expireDays * 24 * 60 * 60 * 1000);
	        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
	    },
	    getCookie: function (name) {
	        var arr, reg = new RegExp('(^|)' + name + '=([^;]*)(;|$)');
	        if (arr = document.cookie.match(reg)) {
	            return arr[2];
	        } else {
	            return null;
	        }
	    },
	    delCookie: function (name) {
	        var exp = new Date();
	        exp.setTime(exp.getTime() - 1);
	        var val = this.getCookie(name);
	        if (val != null) {
	            document.cookie = name + '=' + val + ';expires=' + exp.toGMTString();
	        }
	    }
	};
	if(user_id != CookieParser.getCookie('author_id')){ //当前用户进入的不是自己的设置页面
		jAlert('不可以进入别人的设置页面', '提示');
		return;
	}
	/*用户登录的操作*/
	if(CookieParser.getCookie('name')){
		var name = CookieParser.getCookie('name')
		$('#noLogin').hide();
		$('#hasLogin').show();
		$('#userName').text(decodeURIComponent(name));
		$('#userName').parent().on('mouseover', function(){
			$('.trigger-content').removeClass('hide');
		});
		$('#userName').parent().on('mouseout', function(){
			$('.trigger-content').addClass('hide');
		});
		$('.trigger-content').on('mouseover',function(){
			$(this).removeClass('hide');
		});
		$('.trigger-content').on('mouseout',function(){
			$(this).addClass('hide');
		});
		$('#userName').parent().attr('href', 'user.html?user_id='+CookieParser.getCookie('author_id'));
	}
	
	$('.trigger-content li').on('click', function(){
		if($(this).hasClass('myHome')){
			location.href = 'user.html?user_id='+CookieParser.getCookie('author_id');
		}else if($(this).hasClass('favouriteArticle')){
			location.href = 'user.html?user_id='+CookieParser.getCookie('author_id')+'&type=favourite';
		}else if($(this).hasClass('helpAndCallback')){
			
		}else if($(this).hasClass('setting')){
			location.href = 'setting.html?user_id='+CookieParser.getCookie('author_id');
		}else if($(this).hasClass('loginOut')){
			$('.trigger-content').addClass('hide');
			$('#noLogin').show();
			$('#hasLogin').hide();
			$.ajax({
				type:"post",
				url:"../php/loginOut.php",
				async:true,
				success: function(result){
					if(result.code == 200)
					  location.reload();
				}
			});
		}
	});
	
	//切换menu
	$('.setting_menu li').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		if($(this).hasClass('basic')){
			$('.settingRight .setting-basic').removeClass('hide').siblings().addClass('hide');
		}else if($(this).hasClass('profile')){
			$('.settingRight .setting-profile').removeClass('hide').siblings().addClass('hide');
		}else{
			
		}
	});
	
	$.ajax({
		type:"get",
		url:"../php/user.php",
		async:true,
		data: {userId: user_id}, 
		success: function(result){
			var settingBasicHtml = template('settingBasic', {data: result});
			var settingProfileHtml = template('settingProfile', {data: result});
			$('.setting-basic').html(settingBasicHtml);
			$('.setting-profile').html(settingProfileHtml);
			/*修改头像*/
			$('.avator-content input[type=file]').on('change', function(file){
				var self = this;
				var reader = new FileReader();
			    reader.onload = function(evt) {
			      $('.avatorImage').attr('src', evt.target.result).data('imgName',file.target.files[0].name);
				  var form = new FormData($("#upload_form")[0]);
			      $.ajax({  
			        url:'../php/avator.php',  
			        type:'POST',  
			        data:form,  
			        dataType: 'json',
			        processData:false,
			        contentType: false,
			        processData: false,
                	mimeType:"multipart/form-data",
			        success:function (result){
			        	if(result.code == 200){
			        		/*上传成功后 更改用户头像的信息*/
			        		$.ajax({
			        			type:"post",
			        			url:"../php/saveBasicSetting.php",
			        			async:true,
			        			data: {
			        				author_id: user_id,
			        				avator: result.imageName,
			        				token: CookieParser.getCookie('token'),
			        				mobile: $('#mobile').val(),
			        				email: $('#email').val(),
			        				name: $('#nickName').val(),
			        			},
			        			success: function(result){
			        				if(result.code == 200){
			        					jAlert('头像更改成功','提示');
			        				}else{
										jAlert('当前用户不合法，请重新登录', '提示', function(){
					    					location.href = 'login.html';
					    				});
			        				}
			        			}
			        		});
			        		
			        	}
			        } 
				  });
			    }
			    reader.readAsDataURL(file.target.files[0]);
			});
			
			/*修改微信图片*/
			$('.wechat input[type=file]').on('change', function(file){
				var self = this;
				var reader = new FileReader();
			    reader.onload = function(evt) {
			      $('.wechatImage').attr('src', evt.target.result).data('imgName',file.target.files[0].name).removeClass('hide');
				  var form = new FormData($("#upload_form1")[0]);
			      $.ajax({  
			        url:'../php/wechatImage.php',  
			        type:'POST',  
			        data:form,  
			        dataType: 'json',
			        processData:false,
			        contentType: false,
			        processData: false,
                	mimeType:"multipart/form-data",
			        success:function (result){
			        	if(result.code == 200){
			        		/*上传成功后 更改用户头像的信息*/
			        		$.ajax({
			        			type:"post",
			        			url:"../php/saveProfileSetting.php",
			        			async:true,
			        			data: {
			        				author_id: user_id,
			        				wechatImage: result.imageName,
			        				token: CookieParser.getCookie('token'),
			        				description: $('#description').val(),
			        				sex: $('input[name=sex]:checked').val(),
			        				website: $('#website').val(),
			        			},
			        			success: function(result){
			        				if(result.code == 200){
			        					jAlert('微信二维码上传成功','提示');
			        				}else{
										jAlert('当前用户不合法，请重新登录', '提示', function(){
					    					location.href = 'login.html';
					    				});
			        				}
			        			}
			        		});
			        		
			        	}
			        } 
				  });
			    }
			    reader.readAsDataURL(file.target.files[0]);
			});
			if(location.href.indexOf('favourite')>-1){
				$('.likeArticle').trigger('click');
			}
			
			/*保存基本信息*/
			$('.saveSettingBasic').on('click', function(){
				$.ajax({
        			type:"post",
        			url:"../php/saveBasicSetting.php",
        			async:true,
        			data: {
        				author_id: user_id,
        				token: CookieParser.getCookie('token'),
        				mobile: $('#mobile').val(),
        				email: $('#email').val(),
        				name: $('#nickName').val(),
        				avator: ''
        			},
        			success: function(result){
        				if(result.code == 200){
        					jAlert('更改成功','提示');
        				}else{
        					jAlert(result.message, '提示', function(){
        						location.reload();
        					});
        				}
        			}
        		});
			});
			
			/*保存个人资料*/
			$('.saveSettingProfile').on('click', function(){
				var website = $('#website').val();
				if(website && website.indexOf('http://') != 0){
					jAlert('请按格式输入网址', '提示', function(){
						$('#website').val('');
					});
					return;
					
				}
				$.ajax({
        			type:"post",
        			url:"../php/saveProfileSetting.php",
        			async:true,
        			data: {
        				author_id: user_id,
        				token: CookieParser.getCookie('token'),
        				description: $('#description').val(),
        				website: website,
        				sex: $('input[name=sex]:checked').val(),
        				wechatImage: ''
        			},
        			success: function(result){
        				if(result.code == 200){
        					jAlert('更改成功','提示');
        				}else{
        					jAlert(result.message, '提示', function(){
        						location.reload();
        					});
        				}
        			}
        		});
			});
			
			//删除微信图片
			$('.wechatImage').on('mouseenter', function(){
				$(this).attr('src','../image/delete.jpg').addClass('deleteWechatImage');
			});
			
			$('.wechatImage').on('mouseleave', function(){
				var src = $(this).data('src');
				$(this).attr('src', src).removeClass('deleteWechatImage');
			});
			
			$('body').on('click', '.deleteWechatImage', function(){
				$.ajax({
					type:"post",
					url:"../php/deleteWechatImage.php",
					async:true,
					data: {
						author_id: user_id,
						token: CookieParser.getCookie('token')
					},
					success: function(result){
						if(result.code == 200){
							$(".wechatImage").remove();
        				}else{
							jAlert('当前用户不合法，请重新登录', '提示', function(){
		    					location.href = 'login.html';
		    				});
        				}
					}
				});
			});
		}
	});
});