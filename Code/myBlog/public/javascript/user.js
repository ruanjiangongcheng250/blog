$(function(){
 //goTop的显示以及回到顶部
$('#goTop').backtop();
var user_id = location.search.substr(9);

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
$.ajax({
	type:"get",
	url:"../php/user.php",
	async:true,
	data: {userId: user_id},
	success: function(result){
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
							data: {id: article_id},
							url:"../php/deleteArticle.php",
							async:true,
							success:function(result){
								if(result.code == 200){
									$('article[data-articleid='+article_id+']').hide('slow');
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
			data: {userId: user_id, description: description},
			success: function(result){
				$('.descriptionContent').text(result.description).removeClass('hide');
				$('.editDescriptionContent').addClass('hide');
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
				$('.favouriteArticle').html(articleTplHtml);
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
	})
});