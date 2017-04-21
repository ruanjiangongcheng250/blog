
(function ($) {
    $.fn.extend({
        backtop: function (opts) {
            new BackTop(this,opts)
        }
    })
    function BackTop(ele,opts){
        this.opts= $.extend({},BackTop.DEFAULTS,opts);
        this.ele=$(ele);
        //加载完先判断滚动条位置
        console.log(this)
        this._checkPosition();
        //判断何种动画
        if(this.opts.mode=='move'){
            this.ele.on("click", $.proxy(this._move,this))
        }else {
            this.ele.on("click", $.proxy(this._go,this))
        }
        $(window).on("scroll", $.proxy(this._checkPosition,this))
    }
    BackTop.DEFAULTS={
        //动画方式
        mode:'move',
        //速度
        speed:800,
        //top按钮隐藏显示的临界点
        pos:$(window).height(),
        dest:0
    }
    //判断滚动条当前位置
    BackTop.prototype._checkPosition=function(){
        if($(window).scrollTop()>this.opts.pos){
            this.ele.fadeIn();
        }else {
            this.ele.fadeOut();
        }
    };
    //具有动画效果的返回顶部
    BackTop.prototype._move=function(){
        var opts=this.opts;
        console.log(this.ele);
        $("body,html").stop().animate({
            scrollTop:opts.dest
        },opts.speed)
    };
    //不具有动画效果的返回顶部
    BackTop.prototype._go= function () {
        $(window).scrollTop(this.opts.pos);
    }
})(jQuery)