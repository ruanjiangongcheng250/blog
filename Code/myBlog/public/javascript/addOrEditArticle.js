/*
 * addOrEditArticle.js
 */
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
var article_id = location.search.substr(9);
$('#author').val(CookieParser.getCookie('name'));
if(article_id){ //编辑文章  需要回写之前的内容
	$.ajax({
		type:"get",
		data: {id: article_id},
		url:"../php/getArticleById.php",
		async:true,
		success: function(result){
			var content =  result[0].content;
			var label = result[0].type;
			var title = result[0].name;
			var time = result[0].time;
			setTimeout(function(){
				UE.getEditor('editor').execCommand('insertHtml', content);
				$('.article_label .'+label).addClass('btn-danger');
				$('.addOrEditArticle #name').val(title);
				$('.addOrEditArticle #time').val(time);
			},500);
		}
	});
}else{// 新增文章
	 
}

