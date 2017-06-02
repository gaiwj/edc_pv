template.helper('testFunc', function (arg1, arg2) {
    console.log(arg1,arg2);
    return '223'
})
template.helper('dateFormat', function (date, format) {
    console.log(date,format);
    date = new Date(date);

    var map = {
        "M": date.getMonth() + 1, //ÔÂ·Ý 
        "d": date.getDate(), //ÈÕ 
        "h": date.getHours(), //Ð¡Ê± 
        "m": date.getMinutes(), //·Ö 
        "s": date.getSeconds(), //Ãë 
        "q": Math.floor((date.getMonth() + 3) / 3), //¼¾¶È 
        "S": date.getMilliseconds() //ºÁÃë 
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

template.helper('fmoney', function (s, n) {
   if(s =="" || s == null || s == undefined) {
        s = 0;
   }
    n = n > 0 && n <= 20 ? n : 2;  
    f = s < 0 ? "-" : ""; //判断是否为负数  
    s = parseFloat((Math.abs(s) + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//取绝对值处理, 更改这里n数也可确定要保留的小数位  
    var l = s.split(".")[0].split("").reverse(),  
    r = s.split(".")[1];  
    t = "";  
    for(i = 0; i < l.length; i++ ) {  
       t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
    }  
    return f + t.split("").reverse().join("") + "." + r.substring(0,2);//保留2位小数  如果要改动 把substring 最后一位数改动就可
});

