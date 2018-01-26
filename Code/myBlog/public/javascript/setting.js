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
			var html = template('settingBasic', {data: result});
			$('.setting-basic').html(html);
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
			        			data: {id: user_id, avator: result.imageName},
			        			success: function(){
			        				jAlert('头像更改成功','提示');
			        			}
			        		});
			        		
			        	}
			        } 
				  });
			    }
			    reader.readAsDataURL(file.target.files[0]);
			});
			
			/*保存*/
			$('.saveSettingBasic').on('click', function(){
				
			});
		}
	});
});