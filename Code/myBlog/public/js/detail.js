//detail.js
$(function() {
	//图片懒加载
    $("img.lazy").lazyload({
    	effect : "fadeIn",
    	threshold : 200
    });
    //goTop的显示以及回到顶部
    $('#goTop').backtop();

    //根据id获取文章详情
    loadingShow();
    $.ajax({
    	url:'detail.php',
    	type: 'get',
    	data: {id: location.search.substr(4)},
    	success: function(result){
    		loadingHide();
    		var html = template('articleDetailTpl', {data:result}); 
			$('.article').html(html);
			//发表评论
		    $('.btn-comment').on('click',function(){
		    	var id = location.search.substr(4);
		    	var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		    	var content = $('.inputComments textarea').val();
		    	if(!content){
		    		jAlert('请输入评论','提示');
		    		return;
		    	}
		    	var commentData = {
		    		id: id,
		    		time: time,
		    		content: content,
		    		currentNum: result[0].comment ? result[0].comment.length : 0
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
    
});


