/**
 * Created by asus on 2017/3/1.
 */
var tms = tms || {};

(function($) {
    var me = this;
    window.tmTools = me.util = me.util || {};
    /**
     * util.format('yyyy-mm-dd hh-ii-ss', +new Date());
     * @type {[type]}
     * 传入时间戳或时间字符串，获取时间格式含有各种方式，根据yy、mm、dd、hh、ii、ss来替换匹配
     */
    this.util.format = format;
    /**
     * util.time.getDay(+new Date());
     * @type {[type]}
     * 获取星期值
     */
    this.util.getDay = getDay;
    this.util.htmlEncode = htmlEncode;
    this.util.htmlDecode = htmlDecode;
    this.util.json2str = json2str;
    this.util.removeFromArray = removeFromArray;
    this.util.getUrlParam = getUrlParam;
    // By snowden.xu
    this.util.formatDate = formatDate;
    this.util.isNull=isNull;

    function isNull(value){
        var value=value;
        if(value==""||value==null||value=="undefined"){
            value=""
        }
        return value;
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    function format(format, timestamp) {

        timestamp = new Date(timestamp);

        var year = timestamp.getFullYear(); //获取完整的年份(4位,1970)
        var month = timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1; //获取月份(0-11,0代表1月,用的时候记得加上1)
        var date = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(); //获取日(1-31)

        var hour = timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours(); //获取小时数(0-23)
        var minite = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes(); //获取分钟数(0-59)
        var second = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds(); //获取秒数(0-59)

        return format.replace(/y+/ig, year).replace(/m+/ig, month).replace(/d+/ig, date).replace(/h+/ig, hour).replace(/i+/ig, minite).replace(/s+/ig, second);
    }

    function getDay(timestamp) {
        var Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        return Day[timestamp.getDay()];
    }

    function htmlEncode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    }

    function htmlDecode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    function json2str(json) {
        var arr = [];
        for (var key in json) {
            arr.push(key + '=' + json[key]);
        }
        return arr.join('&');
    }

    function removeFromArray(item, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                break;
            }
        }
        return array;
    }

    // By snowden.xu
    // 格式化字符串日期
    function formatDate(date){
        return (date.substring(0,4) + '.' + date.substring(4,6) + '.' + date.substring(6,8));
    }

}).call(tms, jQuery);



