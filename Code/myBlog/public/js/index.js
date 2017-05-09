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
    	$('header ul li a').removeClass('active');
    	$(this).children('a').addClass('active');
    	var index = $(this).index();
    	$('section>div').addClass('hide').eq(index).removeClass('hide');
    });
    
    //通过点击article_tag 切换选项卡
    $('.article_tag').on('click',function(){
    	var tag = $(this).data('tag');
    	switch(tag) 
    	{
    		case 'healthcare':
    		    $('header ul li a[data-name=healthcare]').trigger('click');
    		break;
    		case 'fitness':
    		    $('header ul li a[data-name=fitness]').trigger('click');
    		break;
    		case 'it':
    		    $('header ul li a[data-name=it]').trigger('click');
    		break;
    		case 'note':
    		    $('header ul li a[data-name=note]').trigger('click');
    		break;
    		default:
    		
    		break;
    	}
    	
    });
});


