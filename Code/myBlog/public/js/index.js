//index.js
$(function() {
	//图片懒加载
    $("img.lazy").lazyload({
    	effect : "fadeIn",
    	//threshold : 200
    });
    //goTop的显示以及回到顶部
    $('#goTop').backtop();
});


