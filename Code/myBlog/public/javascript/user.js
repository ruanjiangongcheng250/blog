$(function(){
 //goTop的显示以及回到顶部
$('#goTop').backtop();
var user_id = parseInt(location.search.substr(9));
//修改登录的url
$('#noLogin a').eq(0).attr('href','login.html?user_id='+user_id);
$('.trigger-menu li').on('mouseenter', function(){
		$(this).addClass('active');
})

$('.trigger-menu li').on('mouseleave', function(){
	if(!$(this).hasClass('current')){
		$(this).removeClass('active');
	}
})

$('.trigger-menu li').on('click', function(){
	var index = $(this).index();
	$(this).siblings('li').removeClass('active').removeClass('current');
	$(this).addClass('active').addClass('current');
	$(this).parent().siblings('div').addClass('hide').eq(index).removeClass('hide');
});
    
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
//退出登录
$('#loginOut').on('click', function(){
	$('#noLogin').show();
	$('#hasLogin').hide();
	$.ajax({
		type:"post",
		url:"../php/loginOut.php",
		async:true,
		success: function(){
			if(result.code == 200)
				location.reload();
		}
	});
});
$.ajax({
	type:"get",
	url:"../php/user.php",
	async:true,
	data: {userId: CookieParser.getCookie('author_id')},
	success: function(result){
		currentUserlikesId = result.likes; //将关注的用户的id 设置为全局
		currentUserfansId = result.fans;
	}
});

$.ajax({
	type:"get",
	url:"../php/user.php",
	async:true,
	data: {userId: user_id},
	success: function(result){
		fansId = result.fans;
		if(result.articles){
			result.articles.forEach(function(item, index){
				item.description = item.description.substr(0,100);
			})
		}
		var articleTplHtml = template('articleTpl', {data: result.articles});
		var userLeftTopTplHtml = template('userLeftTopTpl', {data: result});
		$('.article').html(articleTplHtml);
		$('.userLeftTop').html(userLeftTopTplHtml);
		editOrDeleteArticle(result.articles);
		$('.descriptionContent').text(result.description || '一句话介绍你自己。。。');
		if(result.website){
			$('#personalWebsite').attr('href', result.website);
		}else{
			$('#personalWebsite').addClass('hide');
		}
		if(result.wechatImage){
			$('.personalWechatImage img').attr('src', result.wechatImage);
		}else{
			$('#wechatIcon').addClass('hide');
		}
		//当前主页是否为当前登录用户的主页
		if(user_id == CookieParser.getCookie('author_id')){
			//去掉关注按钮
			$('.addLikes').addClass('hide');
		}else{
			//不可编辑个人介绍
			$('.editPersonDescription').addClass('hide');
			//不可删除/编辑
			$('.deleteArticle, .editArticle').addClass('hide');
			$('.likeArticle span').text('他/她喜欢的文章');
		}
		
		//微信二维码 的显示隐藏
		$('#wechatIcon').on("mouseenter", function(){
			$(".personalWechatImage").removeClass('hide');
		});
		$('#wechatIcon').on("mouseleave", function(){
			$(".personalWechatImage").addClass('hide');
		});
		//加关注/取消关注
		$('.addLikes button').on('click', function(){
			//校验是否登录
	    	if(!CookieParser.getCookie('name')){
	    		location.href = 'login.html?user_id='+ user_id;
	    		return;
	    	}
			var type;
			if($(this).hasClass('hasLiked')){
				type = false;
				$(this).text('加关注').css({backgroundColor: '#42c02e',width: '80px'}).removeClass('CancleAddLikes').removeClass('hasLiked');
				$('.li_fans span').text(parseInt($('.li_fans span').text()) - 1);
			}else{
				type = true;
				$(this).css({width: '100px'}).text('已经关注').addClass('hasLiked');
				$('.addLikes').on('mouseover', '.hasLiked', function(){
					$(this).text('X取消关注').css({backgroundColor: '#969696'}).addClass('CancleAddLikes');
				});
				$('.addLikes').on('mouseout', '.hasLiked', function(){
					$(this).text('已经关注').css({backgroundColor: '#e6e6e6'});
				});
				$('.li_fans span').text(parseInt($('.li_fans span').text()) + 1);
			}
			$.ajax({
				'url': '../php/addLike.php',
				'type': 'post',
				'data': {
					'author_id': CookieParser.getCookie('author_id'), //当前登录用户Id
					'addLikesId': user_id, //要关注的用户id
					'addLikeType': type, //关注类型  true 为关注  false 为取消关注
					'token': CookieParser.getCookie('token')
				},
				'success': function(result){
					if(result.code == 200){
						
					}
				}
			});
		});
		if(fansId.indexOf(CookieParser.getCookie('author_id')) > -1){
			$('.addLikes button').css({width: '100px'}).text('已关注').addClass('hasLiked');
			$('.addLikes').on('mouseover', '.hasLiked', function(){
				$(this).text('X取消关注').css({backgroundColor: '#969696'}).addClass('CancleAddLikes');
			});
			$('.addLikes').on('mouseout', '.hasLiked', function(){
				$(this).text('已关注').css({backgroundColor: '#e6e6e6'});
			});
			$('.addLikes').on('click', '.CancleAddLikes', function(){
				//校验是否登录
				if(!CookieParser.getCookie('name')){
					location.href = 'login.html?user_id='+ user_id;
					return;
				}
				type = false;
				$(this).text('加关注').css({backgroundColor: '#42c02e',width: '80px'}).removeClass('CancleAddLikes').removeClass('hasLiked');
				$.ajax({
					'url': '../php/addLike.php',
					'type': 'post',
					'data': {
						'author_id': CookieParser.getCookie('author_id'), //当前登录用户Id
						'addLikesId': user_id, //要关注的用户id
						'addLikeType': type, //关注类型  true 为关注  false 为取消关注
						'token': CookieParser.getCookie('token')
					},
					'success': function(result){
						if(result.code == 200){
							
						}
					}
				});
			});
		}
		if(location.href.indexOf('favourite')>-1){
			$('.likeArticle').trigger('click');
		}
	}
});

function editOrDeleteArticle (result){
		if(CookieParser.getCookie('name')){  //判断登录用户是否可编辑 删除文章
			result.forEach(function(item,index){
				if(item.author == decodeURIComponent(CookieParser.getCookie('name'))){
				    $('[data-articleid='+item.id+'] .article_content_head button').removeClass('hide');
				    //删除文章
				    $('.modal .confirmDeleteBtn').on('click', function(){
				    	var article_id = $(this).data('articleid');
						$.ajax({
							type:"post",
							data: {
								id: article_id,
								ahthor_id: CookieParser.getCookie('author_id'),
								token: CookieParser.getCookie('token')
							},
							url:"../php/deleteArticle.php",
							async:true,
							success:function(result){
								if(result.code == 200){
									$('article[data-articleid='+article_id+']').hide('slow');
								}else{
									jAlert('当前用户不合法，请重新登录', '提示', function(){
				    					location.href = 'login.html';
				    				});
								}
							}
						});
				    });
				    
				    //编辑文章
				    $('.editArticle').on('click', function(e){
				    	var article_id = $(this).data('articleid');
				    	location.href = 'addOrEditArticle.html?articleid='+article_id;
				    });
				}
			});
			$('#myModal').on('show.bs.modal', function(event){
				var button = $(event.relatedTarget); //Button that triggered the modal
  				var article_id = button.data('articleid');
		    	$(this).find('.confirmDeleteBtn').data('articleid',article_id);
		    });
		}
	}

	//编辑个人介绍
	$('.editPersonDescription').on('click', function(){
		var content = $('.descriptionContent').text().trim();
		$('.descriptionContent').addClass('hide');
		$('.editDescriptionContent textarea').val(content);
		$('.editDescriptionContent').removeClass('hide');
		
	});
	
	$('.btn-save').on('click', function(){
		var description = $('.editDescriptionContent textarea').val();
		$.ajax({
			type:"post",
			url:"../php/editDescription.php",
			async:true,
			data: {
				author_id: user_id,
				description: description,
				token: CookieParser.getCookie('token')
			},
			success: function(result){
				if(result.code == '200'){
					$('.descriptionContent').text(result.description).removeClass('hide');
					$('.editDescriptionContent').addClass('hide');
				}else{
					jAlert('当前用户不合法，请重新登录', '提示', function(){
    					location.href = 'login.html';
    				});
				}
			}
		});
	});
	
	$('.btn-cancle').on('click', function(){
		$('.descriptionContent').removeClass('hide');
		$('.editDescriptionContent').addClass('hide');
		$('.editDescriptionContent textarea').val('');
	});
	
	//喜欢的文章
	$('body').on('click', '.likeArticle', function(){
		var articleArr= decodeURIComponent(CookieParser.getCookie('likesofarticle'));
		$.ajax({
			type:"get",
			url:"../php/getFavouriteArticles.php",
			async:true,
			data: {articleArr: articleArr},
			success: function(result){
				var articleTplHtml = template('articleTpl', {data: result});
				$('div.favouriteArticle').html(articleTplHtml);
			}
		});
		$('.articleSection').addClass('hide');
		$('.userSection').addClass('hide');
		$('.likeSection').removeClass('hide');
	});
	
	$('body').on('click','.nameAndInfo li', function(e){
		if($(this).hasClass('li_fans') || $(this).hasClass('li_likes')){
			$('.userSection').removeClass('hide');
			$('.userSection').siblings().addClass('hide');
			$.ajax({
					url: '../php/getFansOrLikes.php',
					type: 'get',
					data: {userId: user_id, type: 'fans'},
					success: function(result){
						result.forEach(function(item, index){
							for(var i = 0; i<currentUserlikesId.length; i++){
								if(item.id == currentUserlikesId[i]){
									item.hasLiked = true;
								}
							}
							if(item.id == CookieParser.getCookie('author_id')){
								$('.addLikes button').addClass('hasLiked');
							}
						});
						var html = template('fans', {data: result});
						$('.fans div').html(html);
						addLike();
					}
			});
			$.ajax({
					url: '../php/getFansOrLikes.php',
					type: 'get',
					data: {userId: user_id, type: 'likes'},
					success: function(result){
						result.forEach(function(item, index){
							for(var i=0; i< currentUserlikesId.length; i++){
								if(item.id == currentUserlikesId[i]){
									item.hasLiked = true;
								}
							}
						});
						var html = template('likes', {data: result});
						$('.likes div').html(html);
						addLike();
						
					}
			});
			if($(this).hasClass('li_fans')){
				$('.trigger-menu:visible li').eq(1).trigger('click');
			}else{
				$('.trigger-menu:visible li').eq(0).trigger('click');
			}
		}else if($(this).hasClass('li_article')){
			$('.articleSection').removeClass('hide');
			$('.articleSection').siblings().addClass('hide');
			$('.trigger-menu:visible li').eq(0).trigger('click');
		}else{
			
		}
	});
	
	function addLike(){
		//校验是否登录
    	if(!CookieParser.getCookie('name')){
    		location.href = 'login.html?user_id='+ user_id;
    		return;
    	}
		$('li').on('mouseover', '.hasLiked', function(){
			$(this).text('X取消关注').css({backgroundColor: '#969696'});
		})
		$('li').on('mouseout', '.hasLiked', function(){
			$(this).text('已关注').css({backgroundColor: '#e6e6e6'});
		})
		$('li .following').on('click', function(){
			var user_id = $(this).parent().data('userid');
			var self = this;
			var type;
			if($(this).hasClass('hasLiked')){
				type = false;
			}else{
				type = true;
			}
			$.ajax({
				'url': '../php/addLike.php',
				'type': 'post',
				'data': {
					'author_id': CookieParser.getCookie('author_id'), //当前登录用户Id
					'addLikesId': user_id, //要关注的用户id
					'addLikeType': type, //关注类型  true 为关注  false 为取消关注
					'token': CookieParser.getCookie('token')
				},
				'success': function(result){
					if(result.code == 200){
						if($(self).hasClass('hasLiked')){
							$(self).removeClass('hasLiked');
							$(self).text('加关注');
							$(self).parent().find('.info .fensi').text(parseInt($(self).parent().find('.info .fensi').text())-1);
						}else{
							$(self).addClass('hasLiked');
							$(self).text('已关注');
							$(self).parent().find('.info .fensi').text(parseInt($(self).parent().find('.info .fensi').text())+1);
						}
					}else{
						jAlert('当前用户不合法，请重新登录', '提示', function(){
	    					location.href = 'login.html';
	    					return;
	    				});
					}
				}
			});
		})
	}
});