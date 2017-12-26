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
    $.ajax({
    	url:'detail.php',
    	type: 'get',
    	data: {id: article_id},
    	success: function(result){
    		loadingHide();
    		var likesofarticle = CookieParser.getCookie('likesofarticle') ? CookieParser.getCookie('likesofarticle').split(',') : [];
    		for(var i =0; i<likesofarticle.length; i++){
    			if(likesofarticle[i] == article_id){ //说明当前用户已经喜欢了此文章
    				result[0].hasLike = true;
    				break;
    			}
    		}
    		var html = template('articleDetailTpl', {data:result}); 
			$('.article').html(html);
			//发表评论
		    $('.btn-comment').on('click',function(){
		    	//校验是否登录
		    	if(!CookieParser.getCookie('name')){
		    		location.href = 'login.html';
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
		    		author_avator: decodeURIComponent(CookieParser.getCookie('avator'))
		    	}
		    	$.ajax({
		    		url: 'addComment.php',
		    		type: 'post',
		    		data: commentData,
		    		success: function(result){
		    			if(result && result.code == 200){
		    				jAlert('已成功评论','提示',function(){
		    					location.reload();
		    				});
		    			}
		    		}
		    	})
		    });
		    
		    //喜欢/不喜欢文章
		    $('#likeOrUnlike').on('click',function(){
		    	//校验是否登录
		    	if(!CookieParser.getCookie('name')){
		    		location.href = 'login.html';
		    		return;
		    	}
		    	var commitData = {};
		    	commitData.article_id = article_id;
		    	commitData.author_id = CookieParser.getCookie('author_id');
		    	commitData.author_name = CookieParser.getCookie('name');
		    	commitData.number = $('#numberOfLikes').text();
		    	if($(this).attr('src').indexOf('unlike') > -1){
		    		$('#likeOrUnlike').attr('src','../icon/like.png');
		    		commitData.like = true; //代表喜欢
		    		$('#numberOfLikes').text(parseInt($('#numberOfLikes').text())+1);
		    		likesofarticle.push(article_id);
		    	}else{
		    		$('#likeOrUnlike').attr('src','../icon/unlike.png');
		    		$('#numberOfLikes').text($('#numberOfLikes').text()-1);
		    		commitData.like = false;
		    		var index = likesofarticle.indexOf(article_id);
		    		likesofarticle.splice(index,1);
		    	}
		    	CookieParser.setCookie('likesofarticle',likesofarticle.join(','));
		    	//调用服务
		    	$.ajax({
		    		type:"post",
		    		url:"likeArticle.php",
		    		async:true,
		    		data: commitData,
		    		success: function(){
		    			
		    		}
		    	});
		    });
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
	}
	
	//退出登录
	$('#loginOut').on('click', function(){
		$('#noLogin').show();
		$('#hasLogin').hide();
		$.ajax({
			type:"post",
			url:"loginOut.php",
			async:true,
			success: function(){
				
			}
		});
	});
    
});


