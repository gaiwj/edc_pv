/**
 * [description] 通用方法
 * @authors  sky cai
 * @version 1.0.0
 */
var tms = tms || {};

//弹出框
(function($) {
    /**
     * [alert description]
     * @param  {[Object]} params {title,message,cls,}
     * @return {[type]}        [description]
     */
    this.alert = function(params, func) {
        var d = {
            title: '提示',
            message: "",
            cls: "alert-p"
        };
        if (typeof params == 'string') {
            params = {
                message: params
            };
        }else {
            params.cls = d.cls +" "+params.cls;
        }
        $.extend(d, params);
        var html_arr = [
            '<div class="modal fade" id="modal_dialog_alert" tabindex="-1" role="dialog" style="z-index: 99999999;">',
            '<div class="modal-dialog modal-sm modal-center" style="min-width: 400px;">',
            '<div class="modal-content">',
            '<div class="modal-header" style="border-bottom: none;">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="gridSystemModalLabel" style="color: #fff;font-size:18px;"><span></span>'+d.title+'</h4>',
            '</div>',
            '<div class="modal-body">',
            ' <p class="'+d.cls+'" style="text-align: center">'+d.message+'</p>',
            ' </div>',
            ' <div class="modal-footer" style="text-align: center;border-top: none;">',
            '<a href="javascript:void(0)" class="btn btn-cancel" data-dismiss="modal">确定</a>',
            ' </div>',
            ' </div>',
            ' </div>',
            '</div>'
        ];
        if (document.getElementById("modal_dialog_alert")) {
            var element = document.getElementById("modal_dialog_alert");
            element.parentNode.removeChild(element);
        }
        $("body").append(html_arr.join(""));

        setTimeout(function() {
            $("#modal_dialog_alert").modal('show');
            $('#modal_dialog_alert').on('hidden.bs.modal', function () {
                if(func) {
                    func();
                }
            });
        },300);

    };

    /**
     * [confirm description]
     * @param  {[type]} params {title,message,cls,}
     * @return {[type]}        [description]
     */
    this.confirm = function(params, func) {
        var d = {
            title: "提示",
            message: "",
            cls: "alert-p"
        };
        if (typeof params == 'string') {
            params = {
                message: params
            };
        }else {
            params.cls = d.cls +" "+params.cls;
        }
        $.extend(d, params);

        var html_arr = [
            '<div class="modal fade" id="modal_dialog_confirm" tabindex="-1" role="dialog" style="z-index: 99999999;">',
            '<div class="modal-dialog modal-sm modal-center" style="min-width: 450px;" >',
            '<div class="modal-content">',
            '<div class="modal-header" style="border-bottom: none;">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="gridSystemModalLabel" style="color: #fff;font-size:18px;"><span></span>'+d.title+'</h4>',
            '</div>',
            '<div class="modal-body">',
            ' <p class="'+d.cls+'" style="text-align: center">',
            '<span style="top: 0;">'+d.message+'</span>',
            '</p>',
            ' </div>',
            ' <div class="modal-footer" style="text-align: center;border-top: none;">',
            ' <a href="javascript:void(0)" class="btn btn-confirm">确认</a>',
            ' <a href="javascript:void(0)" class="btn btn-cancel" data-dismiss="modal">取消</a>',
            ' </div>',
            ' </div>',
            ' </div>',
            '</div>'
        ];
        if (document.getElementById("modal_dialog_confirm")) {
            var element = document.getElementById("modal_dialog_confirm");
            element.parentNode.removeChild(element);
        }
        $("body").append(html_arr.join(""));

        setTimeout(function() {
            $("#modal_dialog_confirm").modal('show');
            if(func){
                $("#modal_dialog_confirm .btn-confirm").unbind('click').bind('click' , function(){
                    func();
                    $("#modal_dialog_confirm").modal('hide');
                });
            }
        },300);

    };


}).call(tms, jQuery);

/**
 * localStorage
 */
(function () {
    //判断是否支持Local\sessionStroage
    this.supportStroage = function() {
        var flag = true;
        try {
            if (window.localStorage) {
                window.localStorage["test"] = "test";
            } else {
                flag = false;
            }
        } catch (e) { //对于无痕模式下会出现异常
            flag = false;
        }
        return flag;
    };

    //setLocalStorage
    this.setLocalStorage = function(key, value, isJson) {
        if (!this.supportStroage()) {
            alert("当前浏览器不支持localStorage");
            return;
        }
        if (window.localStorage) {
            if (isJson) {
                value = JSON.stringify(value);
            }
            try {
                window.localStorage[key] = value;
            } catch (e) {
                alert("当前浏览器不支持localStorage");
            }

        } else {
            alert("当前浏览器不支持localStorage");
        }
    };

    //getLocalStorage
    this.getLocalStorage = function(key, isJson) {
        if (!this.supportStroage()) {
            alert("当前浏览器不支持localStorage");
            return;
        }
        if (window.localStorage) {
            var value = window.localStorage[key] || "";
            if (isJson && value) {
                value = JSON.parse(value);
            }
            return value;
        } else {
            alert("当前浏览器不支持localStorage");
        }
    };

}).call(tms);

/**
 * 字符串 模板解析
 */
(function( $, undefined ) {
    /**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     *
     * @method $.parseTpl
     * @grammar $.parseTpl(str, data)  ⇒ string
     * @grammar $.parseTpl(str)  ⇒ Function
     * @param {String} str 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'template string'};
     * console.log($.parseTpl(str, data)); // => <p>template string</p>
     */
    $.parseTpl = function( str, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                    .replace( /'/g, '\\\'' )
                    .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                        return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                    } )
                    .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                        return '\');' + code.replace( /\\'/, '\'' )
                                .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                    } )
                    .replace( /\r/g, '\\r' )
                    .replace( /\n/g, '\\n' )
                    .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            /* jsbint evil:true */
            func = new Function( 'obj', tmpl );

        return data ? func( data ) : func;
    };
})( jQuery );
/*
表单赋值
*/
(function(){
    this.setFormValue = function(formId,name, val){
            var $dom=$(formId+" [name='"+name+"']");
            if($dom[0]){
                var type=$dom[0].type;
                //var htmlType = $("[name='"+name+"']").attr("type");
                if(type == "text" || type == "textarea" || type == "hidden" || type == "button"){
                    $(formId+" [name='"+name+"']").val(val);
                }else if(type == "radio"){
                    $(formId+" input[type=radio][name='"+name+"'][value='"+val+"']").iCheck('check');
                }else if(type == "checkbox"){
                    if(typeof(val)=="boolean"){
                        if(val){
                            $(formId+" input[type=checkbox][name='"+name+"']").iCheck('check');
                        }else{
                            $(formId+" input[type=checkbox][name='"+name+"']").iCheck('uncheck');
                        }
                    }else{
                        var vals = val.split(",");
                        for(var i=0; i < vals.length; i++){
                            $(formId+" input[type=checkbox][name='"+name+"'][value='"+vals[i]+"']").attr("checked",true);
                        }
                    }
                }else if($dom.hasClass('select2')){
                    $(formId+" [name='"+name+"']").val(val).change();
                }
            }

    };
}).call(tms)