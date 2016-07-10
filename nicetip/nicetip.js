/**
 * Created by fizzstrack on 2016/7/8.
 *
 * 参考的文章：
 * 1.jQuery插件入门 - web前端工程师 - SegmentFault  https://segmentfault.com/a/1190000005131645
 * 2.理解jquery的$.extend()、$.fn和$.fn.extend()-前端开发博客
 * http://caibaojian.com/jquery-extend-and-jquery-fn-extend.html
 * 3.http://v3.bootcss.com/javascript/#tooltips
 *
 * Todo:
 * 1.placement--设置方向，或者自动识别元素位置智能设置方向，默认为下。
 * 2.配置参数对象字面量，满足用户自定义问题
 * 3.配色方案，优雅
 * 【4.兼容IE7-8？】
 */

//step01 定义JQuery的作用域
(function ($) {

    //step03 插件的默认值属性
    var defaults = {
        color:"nice-yellow",
        timeout:300
    };

    var colorlib = ["nice-white","nice-green","nice-blue","nice-red","nice-black","nice-yellow"];

    //step02 插件的扩展方法名称
    $.fn.nicetip = function (options) {
        var options = $.extend(defaults,options);
        return this.each(function(){
            var elem = $(this);
            //不存在title属性则跳过这个elem
            if(!elem.attr('title')) return true;
            //创建实体
            var tip = new Tip(elem.attr('title'));
            var schedulerEvent = new eventScheduler();
            //利用生成器构造目标DOM，并给这个元素添加容器类
            elem.append(tip.generate()).addClass('niceTipContainer');
            //设置一个变量，检测用户是否自定义了颜色
            var hasClass = false;
            for(var i=0;i<colorlib.length;i++){
                if(elem.hasClass(colorlib[i])){
                    hasClass = true;
                    break;
                }
            }
            if(!hasClass){
                elem.addClass(options.color);
            }

            //添加hover事件
            elem.hover(function(){
                tip.show();
                //当用户第二次hover这个元素时，就清除之前的定时器
                console.log(tip.hasShow);
                schedulerEvent.clear();
            },function(){
                schedulerEvent.set(function(){
                    tip.hide();
                    console.log(tip.hasShow);
                },options.timeout)
            });
            //移出这个title属性
            elem.removeAttr('title');
        });
    };

    //step6-a 在插件里定义方法

    //事件调度器
    function eventScheduler(){}

    eventScheduler.prototype = {
        set: function (func,timeout){
            this.timer = setTimeout(func,timeout);
        },
        clear: function(){
            clearTimeout(this.timer);
        }
    };

    //Tip Class Definition
    function Tip(txt){
        this.content = txt;
        this.hasShow = false;//控制鼠标tip消失之前只有一个tip存在，不重复创建。
    }
    Tip.prototype= {
        generate: function(){
            return this.tip =
                $('<span class="niceTip">'+this.content+
                      '<span class="niceTipShadow"></span><span class="niceTipFiller"></span>'+
                  '</span>');
        },
        show: function(){
            if(this.hasShow) return ;
            this.tip.css('margin-left',-this.tip.outerWidth()/2).fadeIn('fast');

            this.hasShow = true;
        },
        hide: function(){
            this.tip.fadeOut();
            //隐藏完了，设置为false
            this.hasShow = false;
        }
    }
    
})(jQuery);







