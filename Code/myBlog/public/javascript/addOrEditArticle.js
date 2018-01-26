/*
 * addOrEditArticle.js
 */
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
//未登录用户需要登录
if(!CookieParser.getCookie('name')){
	location.href = 'login.html';
}
var article_id = location.search.substr(11);
$('#author').val(decodeURIComponent(CookieParser.getCookie('name')));
//选择标签
$('.article_label button').on('click', function(index,item){
	$(this).siblings().removeClass('btn-danger');
	$(this).addClass('btn-danger');
});
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
	var date = new Date().Format('yyyy-MM-dd');
	 $('.addOrEditArticle h1').text('新建文章');
	 $('.addOrEditArticle #time').val(date);
}

//点击保存文章
$('#saveArticle').on('click', function(){
	var commitData = {};
	commitData.id = article_id;
	commitData.author = CookieParser.getCookie('name');
	commitData.name = $('.addOrEditArticle #name').val();
	commitData.time = $('.addOrEditArticle #time').val();
	commitData.type = $('.article_label .btn-danger').data('type');
	commitData.content = UE.getEditor('editor').getContent();
	commitData.wordNumber = UE.getEditor('editor').getContentTxt().length;
	commitData.description = UE.getEditor('editor').getContentTxt().substr(0,200);
	//验证题目，类型，内容，日期不能为空, 纯文本内容不能少于200字符
	if(!commitData.name){
		jAlert('文章题目不能为空', '提示');
		return;
	}
	if(!commitData.type){
		jAlert('文章标签不能为空', '提示');
		return;
	}
	if(!commitData.time){
		jAlert('日期不能为空', '提示');
		return;
	}
	if(!commitData.content){
		jAlert('文章内容不能为空', '提示');
		return;
	}
	if(UE.getEditor('editor').getContentTxt().length < 200){
		jAlert('文章内容不能少于200字', '提示');
		return;
	}
	$.ajax({
		url: '../php/addOrEditArticle.php',
		type: 'post',
		data: commitData,
		success: function(result){
			if(result.code == 200){
				location.href = 'index.html';
			}
		}
	});
});

