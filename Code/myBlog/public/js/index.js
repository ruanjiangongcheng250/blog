//index.js
$(function() {
	//图片懒加载
    $("img.lazy").lazyload({
    	effect : "fadeIn",
    	threshold : 200
    });
    //goTop的显示以及回到顶部
    $('#goTop').backtop();
    //选项卡的切换
    $('header ul li').on('click',function(){
    	var type = $(this).children('a').data('name');
    	$('header ul li a').removeClass('active');
    	$(this).children('a').addClass('active');
    	var index = $(this).index();
    	$('section>div').addClass('hide').eq(index).removeClass('hide');
    	$.ajax({
    	url:'index.php',
    	data: {type: type},
    	type: 'get',
    	success: function(result){
    		var html = template('articleTpl', {data:result}); 
			$('.'+type).html(html);
    	}
    });
    });
    
   
    loadingShow();
    //获取首页数据
    $.ajax({
    	url:'index.php',
    	type: 'get',
    	data: {type: null},
    	success: function(result){
    		loadingHide();
    		var html = template('articleTpl', {data:result}); 
			$('.article').html(html);
			 //通过点击article_tag 切换选项卡
	    	$('.article_tag').on('click',function(){
	    	var tag = $(this).data('tag');
	    	switch(tag) 
	    	{
	    		case 'healthCare':
	    		    $('header ul li a[data-name=healthCare]').trigger('click');
	    		break;
	    		case 'fitness':
	    		    $('header ul li a[data-name=fitness]').trigger('click');
	    		break;
	    		case 'IT':
	    		    $('header ul li a[data-name=IT]').trigger('click');
	    		break;
	    		case 'note':
	    		    $('header ul li a[data-name=note]').trigger('click');
	    		break;
	    		default:
	    		
	    		break;
	    	}
	    	
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
	            return unescape(arr[2]);
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
	if(location.search.indexOf('name') > -1 && CookieParser.getCookie('name')){
		var name = location.search.substr(location.search.indexOf('=') + 1);
		$('#noLogin').hide();
		$('#hasLogin').show();
		$('#userName').text(decodeURI(name));
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


