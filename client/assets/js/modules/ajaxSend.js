/**
 * @return {[type]} 接口 ajaxSend
 */
var tms = tms || {};

(function($) {
    //ajax封装
    this.ajax = function(options,ajaxType) {
        var activeHost = '/';
        var _params = options.requestBody || {};
        var _path = options.path;
        $.ajax({
            type: ajaxType,
            url:  _path,
            dataType: "json",
            data: _params,
            timeout: 1000 * 300,
            beforeSend: function(XHR) {
                $.isFunction(options.beforCallback) && options.beforCallback();
            },
            success: function(data) {
                //统一处理null值
                if (data) {
                    data = JSON.stringify(data);
                    data = JSON.parse(data.replace(/:null/g, ":\"\""));
                }
                processResult(data, options.callback, options.errCallback);
                if (options.endCallback) options.endCallback(data)
            },
            error: function (req, msg, error) {
                msg = msg || "网络错误";
                if (options.errCallback)
                    options.errCallback(msg);
                else
                    tms.alert(msg);

                 if (options.endCallback) options.endCallback(msg)
            }
        });
    };

}).call(tms, jQuery);

var ajaxSend = {};
ajaxSend.get = function(params, path) {
    //默认请求参数
    var dp = {
        path: path,
        //requestHead:'',
        requestBody: '',
        callback: function(response, status) { //回调函数
            //异常处理...
        }
    };
    $.extend(dp, params);
    tms.ajax(dp,"get");
};

ajaxSend.post = function(params, path) {

    //默认请求参数
    var dp = {
        path: path,
        //requestHead:'',
        requestBody: '',
        callback: function(response, status) { //回调函数
            //异常处理...
        }
    };

    $.extend(dp, params);

    tms.ajax(dp,"post");
};
ajaxSend.put = function(params, path) {

    //默认请求参数
    var dp = {
        path: path,
        //requestHead:'',
        requestBody: '',
        callback: function(response, status) { //回调函数
            //异常处理...
        }
    };

    $.extend(dp, params);

    tms.ajax(dp,"put");
};
ajaxSend.delete = function(params, path) {

    //默认请求参数
    path+="?"
    for(var key in params.requestBody){
        path+=key+"="+params.requestBody[key]+"&"
    }
    var dp = {
        path: path,
        //requestHead:'',
        requestBody: '',
        callback: function(response, status) { //回调函数
            //异常处理...
        }
    };

    $.extend(dp, params);

    tms.ajax(dp,"delete");
};

// 处理请求返回的结果
function processResult(data, callback, errCallback) {
    if (!data||!data.success) {
        var message = "未获取到数据";
        if (errCallback)
            errCallback(message);
        else if(data.error!=""){
            tms.alert(data.error);
        }else
            tms.alert(message);
    }
    else {
        callback(data);
    }
}

// 获取错误提示文本
function getErrorMsg(Code, Message) {
    if (Message) return Message;

    switch (Code) {
        case 1:
            return "操作失败";

        case 901:
            return "保存失败：数据不完整(受试者随机分层因子).";
        case 902:
            return "json格式错误";
        case 903:
            return "文件名或路径过长,发送失败";
        case 904:
            return "签名密码不正确";
        case 905:
            return "条件不满足,请检查";
        case 906:
            return "页面已过期，请刷新";
        case 907:
            return "未找到药物名称对应的编码";
        case 908:
            return "数据被引用";
        case 909:
            return "需要当前项目用户";
        case 910:
            return "项目非法登录";
        case 911:
            return "受试者手机号不能为空";
        case 912:
            return "访视日期或预约日期不能为空";
        case 913:
            return "对不起,您无权执行该操作";
        case 914:
            return "当前研究中心无版本信息";
        case 915:
            return "OID重复绑定";
        case 916:
            return "邮箱无效";
        case 917:
            return "OID已存在，请勿重复添加";
        case 918:
            return "Rank不可重复";
        case 919:
            return "不允许重复添加";
        case 920:
            return "KeySequence已存在";
        case 921:
            return "实验室检验代码已经存在,请更换";
        case 997:
            return Message;
        case 998:
            return "超时请重试";
        case 999:
            return "页面已过期，请刷新";

        case 3000:
            return "登录KEY无效或Code错误";
        case 3001:
            return "用户名或邮箱不存在";
        case 3002:
            return "用户名或密码错误";
        case 3003:
            return "用户被禁用";
        case 3004:
            return "用户无登录权限";
        case 30011:
            return "登录接口程序错误";
        case 3005:
            return "密码强度不符合";
        case 3006:
            return "旧密码不正确";
        case 3007:
            return "修改密码用户信息获取错误";
        case 3008:
            return "密码已使用过";
        case 3014:
            return "密码错误";
        case 3015:
            return "用户信息错误";
        case 3016:
            return "修改用户信息失败";
        case 30051:
            return "修改密码接口程序错误";
        case 3009:
            return "用户项目登录失败";
        case 3010:
            return "用户项目登录临时信息记录失败";

        case 30001:
            return "登录KEY无效或Code接口程序错误";
        case 30002:
            return "帐号密码过期";
        case 30003:
            return "企业账号过期未设定";
        case 30091:
            return "项目登录接口程序错误";
        case 30111:
            return "获取用户信息接口程序错误";
        case 30121:
            return "验证接口程序错误";
        case 30141:
            return "接口程序错误";
        case 30161:
            return "接口程序错误";

        case 300003:
            return "用户服务错误";

        default:
            return "未知的错误";
    }
}

