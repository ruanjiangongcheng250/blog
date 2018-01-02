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
    	if(type == 'picture'){  //相册暂时隐藏搜索功能
    		$('#searchContainer').hide();
    	}else{
    		$('#searchContainer').show();
    	}
    	var index = $(this).index();
    	$('section>div:not("#myModal")').addClass('hide').eq(index).removeClass('hide');
    	$.ajax({
    	url:'../php/index.php',
    	data: {type: type, keyword: null},
    	type: 'get',
    	success: function(result){
    		var html = template('articleTpl', {data:result}); 
			$('.'+type).html(html);
			editOrDeleteArticle(result);
    	}
    });
    });
    
   
    loadingShow();
    //获取首页数据
    $.ajax({
    	url:'../php/index.php',
    	type: 'get',
    	data: {type: null, keyword: null},
    	success: function(result){
    		loadingHide();
    		var html = template('articleTpl', {data:result}); 
			$('.article').html(html);
			editOrDeleteArticle(result);
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
		var name = CookieParser.getCookie('name');
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
			url:"../php/loginOut.php",
			async:true,
			success: function(){
				
			}
		});
	});
	
	//搜索文章
	$('#search').on('click', function(){
		var type = $('header ul li').children('a.active').data('name');
		var keyword = $('#keyword').val();
		$.ajax({
	    	url:'../php/index.php',
	    	type: 'get',
	    	data: {type: type, keyword: keyword},
	    	success: function(result){
	    		loadingHide();
	    		var html = template('articleTpl', {data:result}); 
	    		if(type){
	    			$('.'+type).html(html);
	    		}else{
	    			$('.article').html(html);
	    		}
				editOrDeleteArticle(result);
    	    }
        });
	});
	
	function editOrDeleteArticle (result){
		if(CookieParser.getCookie('name')){  //判断登录用户是否可编辑 删除文章
			result.forEach(function(item,index){
				if(item.author == CookieParser.getCookie('name')){
				    $('[data-articleid='+item.id+'] .article_content_head button').removeClass('hide');
				    $('.modal .confirmDeleteBtn').on('click', function(){
				    	//删除文章
				    	var article_id = $(this).data('articleid');
						$.ajax({
							type:"post",
							data: {id: article_id},
							url:"../php/deleteArticle.php",
							async:true,
							success:function(result){
								if(result.code == 200){
									$('article[data-articleid='+article_id+']').hide('slow');
								}
							}
						});
				    })
				}
			});
			$('#myModal').on('show.bs.modal', function(event){
				var button = $(event.relatedTarget);
  				var article_id = button.data('articleid');
		    	$(this).find('.confirmDeleteBtn').data('articleid',article_id);
		    });
		}
	}
});


