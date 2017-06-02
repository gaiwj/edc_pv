/**
 * Created by liuxiaoshuo
 * Time:2017-5-2
 */
$(function() {
    //用户登录
    $("#loginBtn").click(function () { login(); });
});
function login() {
    $("#errormsg").text("");
    var username = $("#username").val();
    var password = $("#password").val();
    if (username == "" || password == "") {
        showerror("用户名和密码不可为空！");
    }
    else {
        $("#loginBtn").html("登陆中...");
        tms.services.userLogin({
            requestBody: {
                UserName: username,
                PassWord: password
            },
            callback:function (res){
                //例子
                var uc = Cookies.getJSON("usercache");
                uc.CompanyId = res["CompanyId"];
                Cookies.set("usercache",JSON.stringify(uc));
                window.location.href = "/index";
            },
            errCallback:function (msg) {
                $("#loginbtn").html("登陆");
                showerror(msg);
            }
        });
    }
}

// 回车键登录
$(document).keydown(function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        login();
    }
});

function showerror(msg) {
    $("#errormsg").html(( msg));
}
$(document).on('focus','#username,#password',function(){
    showerror('')
})