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
});


