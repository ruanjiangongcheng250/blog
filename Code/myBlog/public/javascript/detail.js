//detail.js
$(function() {
	//图片懒加载
    $("img.lazy").lazyload({
    	effect : "fadeIn",
    	threshold : 200
    });
    //goTop的显示以及回到顶部
    $('#goTop').backtop();
    var article_id = location.search.substr(4);
    //根据id获取文章详情
    loadingShow();
    //修改登录的url
    $('#noLogin a').eq(0).attr('href','login.html?article_id='+article_id);
    $.ajax({
    	url:'../php/detail.php',
    	type: 'get',
    	data: {id: article_id, timeOrder: 0},
    	success: function(result){
			loadingHide();
			//私密文章通过修改链接id进入
			if(result[0] && result[0].isPrivate == "1" && result[0].author != CookieParser.getCookie('name')){
				jAlert('该文章不存在或该文章为私密文章', '提示', function(){
					location.href = 'index.html'
				});
				return;
			}
    		var likesofarticle = CookieParser.getCookie('likesofarticle') ? decodeURIComponent(CookieParser.getCookie('likesofarticle')).split(',') : [];
    		for(var i =0; i<likesofarticle.length; i++){
    			if(likesofarticle[i] == article_id){ //说明当前用户已经喜欢了此文章
    				result[0].hasLike = true;
    				break;
    			}
    		}
    		var contentHtml = template('articleDetailTpl', {data:result[0].content}); 
    		var commentHtml = template('atricleCommentTpl', {data:result}); 
			$('.article').html(contentHtml);
			$('.article').append(commentHtml);
			//发表评论
		    $('.article').on('click','.btn-comment',function(){
		    	//校验是否登录
		    	if(!CookieParser.getCookie('name')){
		    		location.href = 'login.html?article_id='+ article_id;
		    		return;
		    	}
		    	var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		    	var content = $('.inputComments textarea').val();
		    	if(!content){
		    		jAlert('请输入评论','提示');
		    		return;
		    	}
		    	var commentData = {
		    		id: article_id,
		    		time: time,
		    		content: content,
		    		currentNum: result[0].comment ? result[0].comment.length : 0,
		    		author: decodeURIComponent(CookieParser.getCookie('name')),
		    		author_avator: decodeURIComponent(CookieParser.getCookie('avator')),
		    		author_id: decodeURIComponent(CookieParser.getCookie('author_id')),
		    		token: CookieParser.getCookie('token')
		    	}
		    	$.ajax({
		    		url: '../php/addComment.php',
		    		type: 'post',
		    		data: commentData,
		    		success: function(result){
		    			if(result && result.code == 200){
		    				jAlert('已成功评论','提示',function(){
		    					$.ajax({
						    		url: '../php/detail.php',
						    		type: 'get',
						    		data: {id: article_id, timeOrder: 0},
						    		success: function(result){
						    			var likesofarticle = CookieParser.getCookie('likesofarticle') ? decodeURIComponent(CookieParser.getCookie('likesofarticle')).split(',') : [];
							    		for(var i =0; i<likesofarticle.length; i++){
							    			if(likesofarticle[i] == article_id){ //说明当前用户已经喜欢了此文章
							    				result[0].hasLike = true;
							    				break;
							    			}
							    		}
						    			var commentHtml = template('atricleCommentTpl', {data:result});
						    			$('.article_footer').remove();
						    			$('.article').append(commentHtml);
						    		}
						    	})
		    				});
		    			}else{
		    				jAlert('当前用户不合法，请重新登录', '提示', function(){
		    					location.href = 'login.html';
		    				});
		    			}
		    		}
		    	})
		    });
		    //清空
		    $('.article').on('click', '.btn-reset', function(){
		    	$('.inputComments textarea').val('');
		    });
		    //喜欢/不喜欢文章
		    $('.article').on('click','#likeOrUnlike',function(){
		    	var self = this;
		    	//校验是否登录
		    	if(!CookieParser.getCookie('name')){
		    		location.href = 'login.html?article_id='+ article_id;
		    		return;
		    	}
		    	var commitData = {};
		    	commitData.article_id = article_id;
		    	commitData.author_id = CookieParser.getCookie('author_id');
		    	commitData.author_name = CookieParser.getCookie('name');
		    	commitData.token = CookieParser.getCookie('token');
		    	commitData.number = $('#numberOfLikes').text();
		    	if($(this).attr('src').indexOf('unlike') > -1){
		    		commitData.like = true; //代表喜欢
		    	}else{
		    		commitData.like = false;
		    	}
		    	//调用服务
		    	$.ajax({
		    		type:"post",
		    		url:"../php/likeArticle.php",
		    		async:true,
		    		data: commitData,
		    		success: function(result){
		    			if(result.code == '200'){
					    	if($(self).attr('src').indexOf('unlike') > -1){
					    		$('#likeOrUnlike').attr('src','../icon/like.png');
					    		$('#numberOfLikes').text(parseInt($('#numberOfLikes').text())+1);
					    		likesofarticle.push(article_id);
					    	}else{
					    		$('#likeOrUnlike').attr('src','../icon/unlike.png');
					    		$('#numberOfLikes').text($('#numberOfLikes').text()-1);
					    		var index = likesofarticle.indexOf(article_id);
					    		likesofarticle.splice(index,1);
					    	}
		    				CookieParser.setCookie('likesofarticle',likesofarticle.join(','));
		    			}else{
		    				jAlert(result.message+',请重新登录', '提示', function(){
		    					location.href = 'login.html';
		    					return;
		    				});
		    			}
		    		}
		    	});
		    });
		    
		    //按时间倒序
		    $('.article').on('click','.orderByTimeDesc' ,function(){
		    	$.ajax({
		    		url: '../php/detail.php',
		    		data: {id: article_id, timeOrder: 1},
		    		type: 'get',
		    		success: function(result){
		    			var likesofarticle = CookieParser.getCookie('likesofarticle') ? decodeURIComponent(CookieParser.getCookie('likesofarticle')).split(',') : [];
			    		for(var i =0; i<likesofarticle.length; i++){
			    			if(likesofarticle[i] == article_id){ //说明当前用户已经喜欢了此文章
			    				result[0].hasLike = true;
			    				break;
			    			}
			    		}
		    			var commentHtml = template('atricleCommentTpl', {data:result});
		    			$('.article_footer').remove();
		    			$('.article').append(commentHtml);
		    		}
		    	});
		    });
		    
		    //按时间正序
		    $('.article').on('click','.orderByTimeAsc' ,function(){
		    	$.ajax({
		    		url: '../php/detail.php',
		    		data: {id: article_id, timeOrder: 0},
		    		type: 'get',
		    		success: function(result){
		    			var likesofarticle = CookieParser.getCookie('likesofarticle') ? decodeURIComponent(CookieParser.getCookie('likesofarticle')).split(',') : [];
			    		for(var i =0; i<likesofarticle.length; i++){
			    			if(likesofarticle[i] == article_id){ //说明当前用户已经喜欢了此文章
			    				result[0].hasLike = true;
			    				break;
			    			}
			    		}
		    			var commentHtml = template('atricleCommentTpl', {data:result});
		    			$('.article_footer').remove();
		    			$('.article').append(commentHtml);
		    		}
		    	});
		    });
			if(location.href.indexOf('favourite')>-1){
				$('.likeArticle').trigger('click');
			}
    	}
    });
    
    function loadingShow(){
    	$('html').css({
    		'background-color': 'gray',
		    'z-index': 9999,
		    'opacity': 0.5
    	});
    	$('#loading').show();
    }
    
    
    function loadingHide(){
    	$('html').css({
    		'background-color': '',
		    'z-index': 9999,
		    'opacity': 1
    	});
    	$('#loading').hide();
    }
    
        
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
    
    Date.prototype.Format = function(fmt){    
	  var o = {   
	    "M+" : this.getMonth()+1,                 //月份   
	    "d+" : this.getDate(),                    //日   
	    "h+" : this.getHours(),                   //小时   
	    "m+" : this.getMinutes(),                 //分   
	    "s+" : this.getSeconds(),                 //秒   
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	    "S"  : this.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
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
				success: function(){
					
				}
			});
		}
	});
	//退出登录
	$('#loginOut').on('click', function(){
		$('#noLogin').show();
		$('#hasLogin').hide();
		$.ajax({
			type:"post",
			url:"../php/loginOut.php",
			async:true,
			success: function(){
				
			}
		});
	});
    
});


