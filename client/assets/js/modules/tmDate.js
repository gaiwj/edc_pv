/**
 * Created by gwcai on 2017/5/12.
 */
//TMDate
(function ($) {
    function TMDate(el, options) {
        var self = this;
        self.el = el;
        self.opts = options;
        self.init();
    }
    var days = new Array(12);
        days[0] = 31;
        days[2] = 31;
        days[3] = 30;
        days[4] = 31;
        days[5] = 30;
        days[6] = 31;
        days[7] = 31;
        days[8] = 30;
        days[9] = 31;
        days[10] = 30;
        days[11] = 31;
    //判断是否为闰年，针对2月的天数进行计算
    var now = new Date();
    var nowYear = now.getFullYear(),
        nowMonth = now.getMonth() + 1,
        nowDate = now.getDate();
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29
    } else {
        days[1] = 28
    }
    //记录月与日格式
    var mmFormat = "MM",
        ddFormat = "dd";
    var monthEn = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    //wording
    var wordingMap = {year:"年",month:"月",date:"日",hour:"时",minutes:"分",seconds:"秒"};
    TMDate.prototype = {
        //
        init: function () {
            var self = this;
            var format = self.opts.format;
            self.getSelect(format);
            self.loadEvent();
            console.log(self.opts.minYear);
            console.log(self);
        },
        loadEvent: function () {
            var self = this;
            //切换下拉框年份事件
            self.el.on("change","[data-select=year]",function (e) {
                var selectYear = $(this).getValue();
                var year = selectYear - 1900;
                if (Math.round(year / 4) == year / 4) {
                    days[1] = 29
                } else {
                    days[1] = 28
                }

                var monthVal = self._getValueByType("month");
                if(monthVal == "02" || monthVal == "2" || monthVal == "Feb") {
                    self.el.find("[data-select=month]").trigger("change");
                }
                //to do 将来时间
                var showFuture = self.opts.showFuture;
                if(!showFuture && selectYear==nowYear) {
                    self._updateMonthOption(nowMonth);
                }else{
                    var daysNum = days[nowMonth-1];
                    self._updateDateOption(daysNum);
                    self._updateMonthOption(12);
                }

            });

            //切换下拉框月份事件
            self.el.on("change","[data-select=month]",function (e) {
                var month = $(this).getValue();
                if(month == "unknown") {
                    return false;
                }
                //判断是否英文月
                var index;
                if(!/\d/.test(month)){
                    index = monthEn.indexOf(month);
                }else{
                    index = Number(month) - 1;
                }
                var daysNum = days[index];

                //to do 将来时间
                var showFuture = self.opts.showFuture;
                if(!showFuture && index+1==nowMonth) {
                    self._updateDateOption(nowDate);
                }else{
                    self._updateDateOption(daysNum);
                }
            });

            //显示当前日期
            self.el.on("click","#showToday",function (e) {
                var format = self.opts.format;
                var now = new Date();
                var year = now.getFullYear(),
                    month = now.getMonth() + 1,
                    date = now.getDate(),
                    hour = now.getHours(),
                    minutes = now.getMinutes(),
                    seconds = now.getSeconds();
                if(format.indexOf("MMM") > -1 ) {
                    month = monthEn[month-1];
                }else if(format.indexOf("MM") > -1 && month<10){
                    month = "0" + month;
                }
                if(format.indexOf("dd") > -1 && date<10){
                    date = "0" + date;
                }
                if(format.indexOf("HH") > -1 && hour<10){
                    hour = "0" + hour;
                }
                if(format.indexOf("mm") > -1 && minutes<10){
                    minutes = "0" + minutes;
                }
                if(format.indexOf("ss") > -1 && seconds<10){
                    seconds = "0" + seconds;
                }
                self._setValueByType("year",year);
                self._setValueByType("month",month);
                self._setValueByType("date",date);
                self._setValueByType("hour",hour);
                self._setValueByType("minutes",minutes);
                self._setValueByType("seconds",seconds);
            })

        },
        //更新月options
        _updateMonthOption: function (monthsNum) {
            var self = this;
            var options = [];
            for(var m=1;m<=monthsNum;m++){
                var mStr = m;
                if(mmFormat.length == 2 && m<10){
                    mStr = "0" + m;
                }else if(mmFormat.length == 3) {
                    mStr = monthEn[m-1];
                }
                options.push({id:mStr,text:mStr});
            }
            self.el.find("[data-select=month]").empty().select2({
                data:options,
                placeholder:"月"
            });

        },
        //更新日options
        _updateDateOption: function (daysNum) {
            var self = this;
            var options = [];
            //var dateEl = self.el.find("[data-select=date]");
            //var dd = dateEl.find("option")[1].value;
            for(var i=1;i<=daysNum;i++) {
                var dStr = i;
                if(ddFormat.length == 2 && i<10) {
                    dStr = "0" + i;
                }
                options.push({id:dStr,text:dStr});
            }
            self.el.find("[data-select=date]").empty().select2({
                data:options,
                placeholder:"日"
            });
        },
        //获取format里面的间隔符：- 或／或其它
        //return span
        _getSpaceChar: function () {
            var self = this;
            var spaceChar = ["/","-",":"],
                char = "/";
            var format = self.opts.format;
            for(var i=0;i<spaceChar.length;i++) {
                if(format.indexOf(spaceChar[i]) > -1) {
                    char = spaceChar[i];
                    break;
                }
            }

            return char;
        },
        //return data-select year,month...
        _getSelectType: function (shortFormat) {
            var _type = "year";
            if(shortFormat.indexOf("y") > -1) {
                _type = "year";
            }else if(shortFormat.indexOf("M") > -1) {
                _type = "month";
            }else if(shortFormat.indexOf("d") > -1) {
                _type = "date";
            }else if(shortFormat.indexOf("H") > -1) {
                _type = "hour";
            }else if(shortFormat.indexOf("m") > -1) {
                _type = "minutes";
            }else if(shortFormat.indexOf("s") > -1) {
                _type = "seconds";
            }
            return _type;
        },
        //格式与值拆解
        _parseFormatOrValue: function (formatOrValue) {
            var _date_time = formatOrValue.split("T"),
                _date = "",
                _time = "";
            if(_date_time  && _date_time.length >1 ) {
                _date = _date_time[0];
                _time = _date_time[1];
            }else{
                var temp_dt = _date_time[0];
                var isTime = temp_dt.includes(":");
                if(isTime){
                    _time = temp_dt;
                }else {
                    _date = temp_dt;
                }
            }
            return {
                date: _date,
                time:_time
            }
        },
        /**
         * @param {String} shortFormat eg:yyyyu等 MMu dd HH mm ss
         * @returns {DOM} dom
         */
        _selectDom: function (shortFormat) {
            var self = this;
            var unknow = "",
                _default = "",
                dataSelect = "",
                _width = "62px",
                format = shortFormat;
            var _options = [];
            dataSelect = self._getSelectType(shortFormat);
            _default = wordingMap[dataSelect];
            if(shortFormat.includes("H") || shortFormat.includes("m") || shortFormat.includes("s")) {
                _width = "52px";
            }
            var _selectTpl = '<select data-select="'+dataSelect+'" style="width: '+_width+'"></select>';
            //var _option = '<option value="<%=value%>"><%=value%></option>';
            if(format.indexOf("u") > -1) {
                //unknow = '<option value="unknown">未知</option>';
                unknow = {id:"unknown",text:"未知"};
                format = format.substr(0,format.length-1);
            }
            //显示将来时间
            var showFuture = self.opts.showFuture;
            switch (format){
                case "yyyy":
                    var minYear = self.opts.minYear,
                        maxYear = self.opts.maxYear,
                        sortYear = self.opts.sortYear;
                    maxYear = showFuture ? maxYear:nowYear;
                    for(var y=minYear;y<=maxYear;y++){
                        //var opt = $.parseTpl(_option,{value:y});
                        if(sortYear == "desc") {
                            _options.unshift({id:y,text:y});
                        }else{
                            _options.push({id:y,text:y});
                        }
                    }

                    //_default = '<option value="" disabled selected>年</option>';
                    break;
                case "M":
                case "MM":
                case "MMM":
                    var maxMonth = showFuture ? 12:nowMonth;
                    for(var m=1;m<=maxMonth;m++){
                        var mStr = m;
                        if(format.length == 2 && m<10){
                            mStr = "0" + m;
                        }else if(format.length == 3) {
                            mStr = monthEn[m-1];
                        }
                        //var opt = $.parseTpl(_option,{value:mStr});
                        _options.push({id:mStr,text:mStr});
                    }
                    mmFormat = format;
                    //_default = '<option value="" disabled selected>月</option>';
                    break;
                case "d":
                case "dd":
                    var maxDate = showFuture ? 30:nowDate;
                    for(var d=1;d<=maxDate;d++){
                        var dStr = d;
                        if(format.length == 2 && d<10){
                            dStr = "0" + d;
                        }
                        //var opt = $.parseTpl(_option,{value:dStr});
                        _options.push({id:dStr,text:dStr});
                    }
                    ddFormat = format;
                    //_default = '<option value="" disabled selected>日</option>';
                    break;
                case "H":
                case "HH":
                    for(var h=0;h<=23;h++){
                        var hStr = h;
                        if(format.length == 2 && h<10){
                            hStr = "0" + h;
                        }
                        //var opt = $.parseTpl(_option,{value:hStr});
                        _options.push({id:hStr,text:hStr});
                    }
                    break;
                case "m":
                case "mm":
                case "s":
                case "ss":
                    for(var i=0;i<=59;i++){
                        var hStr = i;
                        if(format.length == 2 && i<10){
                            hStr = "0" + i;
                        }
                        //var opt = $.parseTpl(_option,{value:hStr});
                        _options.push({id:hStr,text:hStr});
                    }
                    break;

            }
            if(unknow) {
                _options.unshift(unknow);
            }
            var _select = $(_selectTpl);
           /* _select.empty().select2({
                data: _options,
                placeholder: _default
            })*/

            /*var html = $.parseTpl(_tpl,{options:_options.join("")});
            var div = document.createElement('div');
            div.innerHTML = html;*/
            var select = {
                el:_select,
                data: _options,
                placeholder: _default
            }
            return select;
        },
        /**
         * @param {String} format eg:{yyyy}-{MM}-{dd}
         * @param {String} sort eg:desc,asc
         * 得到年月日下拉框  reg = /\{[\s\S]*?\}/gi
         * @returns {DOM} dom对象
         */
        getSelect: function (format) {
            var self = this;
            self.el.empty();
            var reg = /\{[\s\S]*?\}/gi;

            //多个空格format.replace
            var date_time = format.split("T");
            var dateFormat = date_time[0];
            var dateFormatArray = dateFormat.match(reg);//["{yyyy}", "{MM}", "{dd}"]
            var spaceChar = self._getSpaceChar();
            var spaceCharNum = dateFormatArray.length -1;
            var shortFormatArray = format.match(reg);//["{yyyy}", "{MM}", "{dd}",{HH},{mm},{ss}]
            for(var i=0;i<shortFormatArray.length;i++) {
                var shortFormat = shortFormatArray[i].replace(/[\{\}]/ig,"");
                var select = self._selectDom(shortFormat);
                self.el.append(select.el);
                select.el.empty().select2({
                    data: select.data,
                    placeholder: select.placeholder
                });
                if(i<spaceCharNum) {
                    var span = $('<span style="margin: 0 6px;">'+spaceChar+'</span>');
                    self.el.append(span);
                }else if(i == spaceCharNum && date_time.length == 2) {//
                    var span = $('<span style="margin: 0 6px;"></span>');
                    self.el.append(span);
                }else if(i < (shortFormatArray.length -1)) {
                    var span = $('<span style="margin: 0 3px;">:</span>');
                    self.el.append(span);
                }
            }
            //显示转到今天按钮
            var showToday = self.opts.showToday;
            if(showToday) {
                var tips = $('<i id="showToday" class="fa fa-cog fa-fw" style="margin: 10px;cursor: pointer;"></i>');
                self.el.append(tips);
            }
            //初始化默认值
            var value = self.opts.value;
            self.setSelectValue(value);

        },
        //得到日期字符:unkw-05-15,通过日期格式{yyyyu}-{MM}-{dd}
        //self.opts.format
        getSelectValue: function () {
            var self =this;
            var dateValues = [],//存放年月日
                timeValues = [],
                selectValue = "";
            var format = self.opts.format;
            var reg = /\{[\s\S]*?\}/gi;
            var _parseFormat =  self._parseFormatOrValue(format);
            var spaceChar = self._getSpaceChar();
            if(_parseFormat.date) {
                var yy_mm_dd = _parseFormat.date.match(reg);//["{yyyy}", "{MM}", "{dd}"]
                for(var i=0;i<yy_mm_dd.length;i++) {
                    var _format = yy_mm_dd[i].replace(/[\{\}]/ig,"");//"yyyy"
                    var _type = self._getSelectType(_format);
                    var _value = self._getValueByType(_type);
                    //to do
                    if(_value == "unknown") {
                        _value = "unkw";
                    }
                    dateValues.push(_value);
                }
            }
            selectValue = dateValues.join(spaceChar);
            //针对时间取值
            if(_parseFormat.time) {
                var hh_mm_ss = _parseFormat.time.match(reg);
                for(var j=0;j<hh_mm_ss.length;j++) {
                    var _format = hh_mm_ss[j].replace(/[\{\}]/ig,"");
                    var _type = self._getSelectType(_format);
                    var _value = self._getValueByType(_type);
                    if(_value == "unknown") {
                        _value = "unkw";
                    }
                    timeValues.push(_value);
                }
                selectValue += " " + timeValues.join(":");
            }
            return selectValue;

        },
        //设置控件年月日等选中值unkw-05-15 13:50:55,通过日期格式{yyyyu}-{MM}-{dd}
        setSelectValue: function (value) {
            var self = this;
            if(!value) {
                //显示placeholder
                self._setValueByType("year","");
                self._setValueByType("month","");
                self._setValueByType("date","");
                self._setValueByType("hour","");
                self._setValueByType("minutes","");
                self._setValueByType("seconds","");
                return false;
            }
            var format = self.opts.format;
            var reg = /\{[\s\S]*?\}/gi;
            //值拆解
            value = value.replace(/\s+/ig,"T");
            var _parseValue =  self._parseFormatOrValue(value);
            //格式拆解
            var _parseFormat =  self._parseFormatOrValue(format);

            var spaceChar = self._getSpaceChar();
            if(_parseValue.date) {
                var yy_mm_dd = _parseFormat.date.match(reg);//["{yyyy}", "{MM}", "{dd}"]
                var yy_mm_dd_val = _parseValue.date.split(spaceChar);// [unkw,05,15]
                for(var i=0;i<yy_mm_dd_val.length;i++) {
                    var _val = yy_mm_dd_val[i];//"unkw"
                    var _format = yy_mm_dd[i].replace(/[\{\}]/ig,"");//"yyyy"
                    var _type = self._getSelectType(_format);
                    if(_val == "u" || _val == "uk" || _val == "unk" ) {
                        _val = "unknown";
                    }
                    self._setValueByType(_type,_val);
                }
            }
            //针对时间赋值
            if(_parseValue.time) {
                var hh_mm_ss = _parseFormat.time.match(reg);//["HH","mm"]
                var hh_mm_ss_val = _parseValue.time.split(":");
                for(var j=0;j<hh_mm_ss_val.length;j++) {
                    var _val = hh_mm_ss_val[j]; //23时
                    var _format = hh_mm_ss[j].replace(/[\{\}]/ig,"");//"HH"
                    var _type = self._getSelectType(_format);
                    if(_val == "u" || _val == "uk" || _val == "unk" ) {
                        _val = "unknown";
                    }
                    self._setValueByType(_type,_val);
                }
            }
        },
        //获取单个下拉框的值type=year,month,date,hour,minutes,seconds
        _getValueByType: function (type) {
            var self = this;
            var _value = self.el.find("[data-select='"+type+"']").val();
            return _value;
        },
        _setValueByType: function (type,value) {
            var self = this;
            //self.el.find("[data-select='"+type+"']").setValue(value);
            self.el.find("[data-select='"+type+"']").val(value).trigger("change");
        }
    }

    $.fn.tmdate = function (options) {
        var self = this;
        var options = options || {};

        //self.opts = $.extend({}, $.fn.tmdate.defaults, options);
        var tmdate = [];
        self.each( function( i ) {
            var el = $(this);
            var domParam = {};
            domParam.format = el.attr("data-format");
            domParam.value = el.attr("data-value");
            domParam.minYear = el.attr("data-minYear");
            domParam.maxYear = el.attr("data-maxYear");
            domParam.showToday = el.attr("data-showToday");
            domParam.showFuture = el.attr("data-showFuture");
            domParam.sortYear = el.attr("data-sortYear");
            domParam.between = el.attr("data-between");
            if(domParam.showToday) {
                domParam.showToday = domParam.showToday.includes("true") ? true:false;
            }
            if(domParam.showFuture) {
                domParam.showFuture = domParam.showFuture.includes("true") ? true:false;
            }
            if(domParam.between) {
                domParam.between = domParam.between.includes("true") ? true:false;
            }
            el.opts = $.extend({}, $.fn.tmdate.defaults, domParam, options);
            el.opts.format = el.opts.format.replace(/\s+/ig,"T");
            //var _tmdate = new TMDate(el, el.opts);
            var _tmdate = {};
            if(el.opts.between) {
                var first = $("<div class='tmdate' style='display: inline-block;'>");
                var second = $("<div class='tmdate'>");
                _tmdate = {
                    first: new TMDate(first,el.opts),
                    second: new TMDate(second,el.opts)
                }
                el.append(first);
                var span = $('<span style="margin: 0 6px;"> / </span>');
                el.append(span);
                el.append(second);
                second.width(first.width());
            }else{
                _tmdate = new TMDate(el, el.opts);
            }
            tmdate.push(_tmdate);
        } );
        //var tmdate = new TMDate(self, self.opts);
        return tmdate.length > 1 ? tmdate:tmdate[0];
    }

    /**
     *  format:{yyyy}-{MM}-{dd}
     *  value:2017-05-15
     *  minYear:可选最小年份
     *  maxYear:可选最大年份
     *  showFuture:显示将来时间
     *  sortYear:年份排序desc,asc
     *  showToday:是否显示当前时间，标识
     *  between:是否分隔时间"/"
     ***/
    $.fn.tmdate.defaults = {
        minYear:1900,
        maxYear:2020,
        format:"{yyyy}-{MM}-{dd}",
        value:"",
        showToday:true,
        showFuture:true,
        between:false,
        sortYear:"desc"
    }
})(window.jQuery);

