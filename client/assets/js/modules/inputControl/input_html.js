/**
 * Created by xiaoshuo.liu on 2017/5/17.
 */

// 扩展jQuery函数
{
    // 初始化预定义控件
    $.prototype.initControls = function (servertime) {
        ControlService.initControls(this, servertime);
        return this;
    }
    // 通用地获取一个jdom对应的控件的值（不经过验证）
    // doescape：是否对value进行escape操作，默认为否
    $.prototype.getRControlValue = function (doescape) {
        var jdom = this;
        var value = "";
        var isarray = false;

        var rcontrol = jdom.RControl();
        value = rcontrol.value();
        if (jdom.hasClass("type_rInputCheckboxGroup") || jdom.hasClass("type_rUploadify")) isarray = true;

        // 进行escape
        if (doescape == true) {
            if (isarray == true) {
                for (var i = 0; i < value.length; i++)
                    value[i] = escape(value[i]);
            }
            else {
                value = escape(value);
            }
        }

        return {
            value: value,
            isarray: isarray
        };
    }
    
    // 通用地设置一个jdom对应的控件的值
    $.prototype.setRControlValue = function (value) {
        var jdom = this;
        if (jdom.hasClass("type_rUploadify")) return jdom;
        if (jdom.hasClass("type_rDatepicker")) {
            jdom.RDatepicker().setTimeWithFormat(value);
        }
        else {
            jdom.RControl().value(value);
        }
        return jdom;
    }
    // 通用地获取一个jdom对应的控件的值是否为空
    $.prototype.isRControlValueNull = function (value) {
        var jdom = this;
        var value = "";
        var isarray = false;

        var rcontrol = jdom.RControl();
        if (rcontrol.check()) {
            value = rcontrol.value();
            if (jdom.hasClass("type_rInputCheckboxGroup") || jdom.hasClass("type_rUploadify")) isarray = true;
            if (isarray) {
                return (value.length <= 0);
            }
            else {
                return (!value || value == "");
            }
        }
        else {
            return true;
        }
    }

    // 【多元素操作】通用地将一个jdom对应的控件的值置为空（若存在默认值则会置为默认值）
    $.prototype.clearRControlValue = function () {
        this.each(function () {
            var jdom = $(this);
            var defaultv = jdom.attr("default");
            if (defaultv && defaultv != "") {
                jdom.setRControlValue(defaultv);
            }
            else {
                if (jdom.hasClass("type_rInputRadio")) {
                    jdom.RInputRadio().checked(false);
                }
                else if (jdom.hasClass("type_rInputCheckbox")) {
                    jdom.RInputCheckbox().checked(false);
                }
                else {
                    jdom.RControl().clearValue();
                }
            }
        });
        return this;
    }
}

// 控件服务
{
    // 控件服务
    var ControlService = {
        // 服务器时间
        servertime: new Date(),
        intervalhandle: null,
        // 初始化预定义控件
        initControls: function (jdom) {
            var obj = this;
            var myDate = new Date();
            var toDate = myDate.toLocaleDateString();
            if (!jdom || !jdom.length)
                jdom = $(document.body);


            //tableStyle事件
            jdom.find(".tableStyle .trStyle").unbind("mouseenter").unbind("mouseleave").mouseenter(function () {
                $(this).addClass("trStyle_hot");
            }).mouseleave(function () {
                $(this).removeClass("trStyle_hot");
            });

            // 控件初始化
            jdom.find(".type_rButton").RButton().init();
            jdom.find(".type_rButton_skin1").RButton().init();
            //jdom.find(".type_rSelect").RSelect().init();
            jdom.find(".type_rInputText").RInputText().init();
            jdom.find(".type_rTextarea").RTextarea().init();
            jdom.find(".type_rInputRadio").RInputRadio().init();
            jdom.find(".type_rInputCheckbox").RInputCheckbox().init()

            jdom.find(".type_rSelect").each(function () {
                var jObj = $(this);

                jObj.RSelect().init().changed(function () {
                    ControlService.updateServant(jObj);
                });
            });


            // jdom.find(".type_rInputRadioGroup").RInputRadioGroup().init()
            jdom.find(".type_rInputRadioGroup").each(function () {
                var jObj = $(this);

                jObj.RInputRadioGroup().init().changed(function () {
                    ControlService.updateServant(jObj);
                });
            });


            // jdom.find(".type_rInputCheckboxGroup").RInputCheckboxGroup().init()
            jdom.find(".type_rInputCheckboxGroup").each(function () {
                var jObj = $(this);
                jObj.RInputCheckboxGroup().init().changed(function () {
                    ControlService.updateServant(jObj)
                });
            });
            //
            jdom.find('*[mark="dialog"]').each(function () {
                var id = $(this).attr('subsidiaryid');
                $('#field-items-hidden-container-' + id).empty();
                $('#field-items-body-modal-' + id).empty();

            });


            jdom.find(".type_rUploadify").RUploadify().init({
                swf: '/js/uploadify/uploadify.swf',
                uploader: '/Ajax/UploadFile.aspx'
            });

            ///初始化select2
            jdom.find('.select2_type').each(function () {
                var jObj = $(this);
                jObj.select2()
            })

            // 自动计算按钮
            jdom.find(".calcbtn").unbind("click").click(function () {
                var id = $(this).attr("calcid");
                var calcid = $("#" + id);
                ControlService.calcFormula(calcid);
            });

            // 日期选择框
            jdom.find(".input_date").unbind("focus").unbind("click").focus(function () {

                if (this.parentNode.innerText === "不良事件发生时间：" || this.parentNode.innerText === 'Event Onsite Date：') {
                    WdatePicker({
                        dateFmt: 'yyyy/MM/dd', maxDate: '#F{$dp.$D(\'578396b8-e1e4-452a-a980-aedd9d6ca027\')||\'2099-10-01\'}'
                    });
                }
                else if (this.parentNode.innerText === "不良事件结束时间：" || this.parentNode.innerText === 'Event Stop Date：') {
                    WdatePicker({
                        dateFmt: 'yyyy/MM/dd', minDate: '#F{$dp.$D(\'43399d89-b1ef-4602-9c5f-9ea8fc372239\')}', maxDate: '2099-10-01'
                    });
                }
                else if (this.parentNode.innerText === '用药开始时间：' || this.parentNode.innerText == 'Drug Start Date：') {
                    WdatePicker({
                        dateFmt: 'yyyy/MM/dd', maxDate: '#F{$dp.$D(\'c6466d75-7a9e-49a8-958e-107bf12300ff\')||\'2099-10-01\'}'
                    });
                }
                else if (this.parentNode.innerText === '用药结束时间（如适用）：' || this.parentNode.innerText == 'Drug stop date (If applicable)：') {
                    WdatePicker({
                        dateFmt: 'yyyy/MM/dd', minDate: '#F{$dp.$D(\'a4564f04-97cb-4987-83cd-e838a74a74fb\')}', maxDate: '2099-10-01'
                    });
                }
                //else if (this.parentNode.innerText === "出生日期：" || this.parentNode.innerText === 'Patient DOB：') {
                //    WdatePicker({
                //        dateFmt: 'yyyy/MM/dd', maxDate: toDate
                //    });
                //}
                else {
                    WdatePicker({

                    });
                }

            }).click(function () {
                WdatePicker();
            });


            // 【日期】
            var servertimeobj1 = {
                year: obj.servertime.getFullYear(),
                month: obj.servertime.getMonth() + 1,
                date: obj.servertime.getDate(),
                hour: obj.servertime.getHours(),
                minute: obj.servertime.getMinutes(),
                second: obj.servertime.getSeconds()
            };
            jdom.find(".type_rDatepicker").each(function () {
                var jObj = $(this);
                var isfuture = jObj.attr("isfuture");
                var lastvalue = jObj.attr("lastvalue");
                var control = jObj.RDatepicker().skin("skin1");
                if (isfuture == "false") {
                    var maxvalue = control.formatTimeToString(servertimeobj1);
                    control.maxValue(maxvalue, false);
                }
                control.init();
                control.setTimeWithFormat(lastvalue);
                control.onPicked(function () {
                    if (jObj.hasClass("formItem")) {
                        if (obj._event4) obj._event4(jObj);
                    }
                });
            });

            if (obj.intervalhandle == null)
                obj.intervalhandle = setInterval(function () {
                    var now = new Date();
                    if (now.getSeconds() != 0) return;
                    //obj.servertime.setTime(obj.servertime.getTime() + 1000 * 60);
                    obj.servertime.setMinutes(obj.servertime.getMinutes() + 1);
                    var servertimeobj2 = {
                        year: obj.servertime.getFullYear(),
                        month: obj.servertime.getMonth() + 1,
                        date: obj.servertime.getDate(),
                        hour: obj.servertime.getHours(),
                        minute: obj.servertime.getMinutes(),
                        second: obj.servertime.getSeconds()
                    };
                    jdom.find(".type_rDatepicker").each(function () {
                        var jdom = $(this);
                        var isfuture = jdom.attr("isfuture");
                        var control = jdom.RDatepicker();
                        if (isfuture == "false") {
                            var maxvalue = control.formatTimeToString(servertimeobj2);
                            control.maxValue(maxvalue);
                        }
                    });
                }, 1000);
            ////

            return obj;
        },
        // 更新一个主项的从项的显示隐藏，传入一个控件的jdom对象
        updateServant: function (jdom) {
            var obj = this

            var curid = jdom.attr("id");
            var curvalue = jdom.getRControlValue();
            if (jdom.attr('oldvalue')) {
                var oldValue = JSON.parse(jdom.attr('oldvalue'));
                jdom.attr('oldvalue', JSON.stringify(curvalue.value))
            }
            //弹窗HTML
            var dailog = (function () {
                var html = '<div id="field-items-modal-' + curid + '" class="modal fade" data-backdrop="static" style="top:15%">' +
                    '<div class="modal-dialog mesBox">' +
                    '<div class="modal-content" style="width:1010px">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<h4 class="modal-title">' + jdom.next().attr('dialogtitle') + '</h4>' +
                    '</div>' +
                    '<div  class="modal-body popCon">' +
                    '<ul  id="field-items-body-modal-' + curid + '" class=" list drugBox"></ul>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    //'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal">关闭</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div id="field-items-hidden-container-' + curid + '" style="display:none"></div>';//隐藏域用于暂存子控件
                if ($('#field-items-modal-' + curid).length == 0) {
                    $('form').append(html);
                }
                return $('#field-items-modal-' + curid);
            })();
            dailog.on("shown.bs.modal", function (e) {
                $("#field-items-hidden-container-" + curid).empty();
            });
            dailog.on("hidden.bs.modal", function (e) {
                //关闭弹窗事

                var liList = $("#field-items-body-modal-" + curid).find("li");
                if (liList.length != 0) {
                    $("#field-items-hidden-container-" + curid).append(liList);

                }
                $("#field-items-body-modal-" + curid).empty();
                //console.log("hidden.bs.modal", liList.length);

            });
            var subItemsControlsShow = [];//显示关联子控件
            var subItemsControlsHide = [];//隐藏关联子控件
            // 遍历所有控件寻找子控件 显示与隐藏关联子控件
            var oldflag = false;
            $(".formitems").each(function () {
                var item = $(this);

                var subsidiaryid = item.attr('subsidiaryid');
                var subsidiaryvalue = item.attr('subsidiaryvalue');

                if (!subsidiaryid || subsidiaryid == "") return;
                if (!subsidiaryvalue || subsidiaryvalue == "") return;
                subsidiaryvalue = JSON.parse(subsidiaryvalue)
                var flag = false;
                var SubsidiaryIsRequired = JSON.parse(item.attr('SubsidiaryIsRequired'));
                var SubsidiaryIconType = JSON.parse(item.attr('SubsidiaryIconType'));
                if (curid == subsidiaryid) {

                    if (item.parent().is('td')) {
                        /////为了处理QC管理中的子控件关联问题
                        item.parents('tr').find('td:eq(0)').css('color', 'red')
                    } else {
                        item.parent().find('span:eq(0)').css('color', 'red')
                    }
                    // 如果是数组
                    if (curvalue.isarray) {


                        for (var i = 0; i < curvalue.value.length; i++) {
                            if ($.inArray(curvalue.value[i], subsidiaryvalue) != -1 && jdom.hasClass('RSelect')) {
                                var index = $.inArray(curvalue.value[i], subsidiaryvalue);
                                //SubsidiaryIsRequired=SubsidiaryIsRequired.split(',')
                                if (SubsidiaryIsRequired[index] == '1') {
                                    item.attr('ismust', 'ismust').addClass('RInputText_must ')
                                    if (SubsidiaryIconType[index] == "ADR") {
                                        item.prev().html('<span class="adrIcon"></span>' + item.prev().text())
                                    } else {
                                        item.removeAttr('ismust', 'ismust').removeClass('RInputText_must ')
                                        item.prev().find('.adrIcon').remove()
                                    }
                                    flag = true;
                                    break;
                                } else {
                                    item.removeAttr('ismust', 'ismust').removeClass('RInputText_must ')
                                    item.prev().find('.adrIcon').remove()
                                    flag = true;
                                    break;
                                }
                            } else if ($.inArray(curvalue.value[i], subsidiaryvalue) != -1) {
                                flag = true;
                                break;
                            }
                        }
                        var currentArry = curvalue.value;
                        var selectSubid = '';
                        if (jdom.hasClass('RInputCheckboxGroup')) {
                            if (jdom.next().is('i.showHideControlDialog')) {
                                selectSubid = jdom.next().attr('subid');
                                if (selectSubid != '' && $.inArray(selectSubid, curvalue.value) != -1 && $.inArray(selectSubid, oldValue) == -1) {
                                    flag = true;
                                } else {
                                    flag = '';
                                }
                                if ($.inArray(selectSubid, curvalue.value) == -1 && $.inArray(selectSubid, oldValue) != -1) {
                                    flag = false;
                                }
                                if ($.inArray(selectSubid, curvalue.value) != -1 && $.inArray(selectSubid, oldValue) != -1 && curvalue.value.length == oldValue.length) {
                                    flag = true;
                                }
                            }
                            // var newarry=[];
                            // $.each(curvalue.value,function(i,n){
                            //     if($.inArray(n, oldValue)==-1){
                            //         newarry.push(n)
                            //     }
                            // })
                            // if(currentArry.length!=oldValue.length){
                            //     $.extend(curvalue,{value:newarry})
                            // }
                        }

                    }
                    else {
                        if ($.inArray(curvalue.value, subsidiaryvalue) != -1 && jdom.hasClass('RSelect')) {
                            var index = $.inArray(curvalue.value, subsidiaryvalue);
                            //SubsidiaryIsRequired=SubsidiaryIsRequired.split(',')
                            if (SubsidiaryIsRequired[index] == '1') {
                                item.attr('ismust', 'ismust').addClass('RInputText_must ')
                                if (SubsidiaryIconType[index] == "ADR") {
                                    item.prev().html('<span class="adrIcon"></span>' + item.prev().text())
                                } else {
                                    item.removeAttr('ismust', 'ismust').removeClass('RInputText_must ')
                                    item.prev().find('.adrIcon').remove()
                                }
                                flag = true;
                            } else {
                                //item.removeAttr('ismust', 'ismust').removeClass('RInputText_must ')
                                //item.prev().find('.adrIcon').remove()
                                flag = true;
                            }
                        }
                        else if ($.inArray(curvalue.value, subsidiaryvalue) == -1 && jdom.hasClass('RSelect') && SubsidiaryIconType.length > 1 && isNull(SubsidiaryIconType[1]) != "") {
                            item.removeAttr('ismust', 'ismust').removeClass('RInputText_must ')
                            item.prev().find('.adrIcon').remove()
                            flag = true;
                        } else if ($.inArray(curvalue.value, subsidiaryvalue) != -1) {// 如果不是数组
                            flag = true;
                        }
                    }
                    if (flag == true) {
                        subItemsControlsShow.push(item);
                        //item.parent().show();
                        //$('.ZJSY').css('display', 'inline-block');
                        //$('.ZJSY').find('span:eq(0)').css('color', 'red')
                    }
                    else if (flag === false) {
                        subItemsControlsHide.push(item);
                        //item.parent().hide();
                        //item.val("")
                        //$('.ZJSY').css('display', 'none');
                    }
                }
                //else if (curid == subsidiaryid && SubsidiaryIsRequired != "" || SubsidiaryIsRequired != "0") {
                //    SubsidiaryIsRequired=SubsidiaryIsRequired.split(',');
                //    if (curvalue.isarray) {
                //    }else {
                //        var index=$.inArray(curvalue.value,subsidiaryvalue)
                //        if(index!=-1){
                //            if(SubsidiaryIsRequired[index]=="1"){
                //                item.attr('ismust','ismust').addClass('RInputText_must ')
                //                if(SubsidiaryIconType[index]=="ADR"){
                //                    item.prev().html('<span class="adrIcon"></span>'+item.prev().text())
                //                }
                //            }else{
                //                item.removeAttr('ismust','ismust').removeClass('RInputText_must ')
                //                item.prev().find('.adrIcon').remove()
                //            }
                //        }else{
                //            item.removeAttr('ismust','ismust').removeClass('RInputText_must ')
                //            item.prev().find('.adrIcon').remove()
                //        }
                //    }
                //}
            });

            $.each(subItemsControlsShow, function (index, item) {
                if (index == 0) {
                    $('#field-items-body-modal-' + curid).empty();
                }
                if (JSON.stringify(oldValue) != JSON.stringify(curvalue.value) && jdom.hasClass('RSelect')) {
                    item.setRControlValue("")
                }
                if (item.attr('mark') === "dialog") {
                    //弹窗
                    $('#field-items-body-modal-' + curid).append(item.parent());
                    item.parent().show();
                    $('#' + item.attr('subsidiaryid')).next().show()
                    item.removeProp('disabled').removeAttr('disabled').remove('readonly')
                } else {
                    //显示
                    // if (jdom.attr('mark') ==='dialog') {
                    //     $('#field-items-body-modal-'+curid).append(item.parent());
                    // }
                    if (item.parent().is('td')) {
                        item.parents('tr').css('display', 'table-row');
                    } else {
                        item.parent().show();
                    }
                    if ($.inArray('32cb46e1-f9be-4eea-a12e-6a864f45c442', JSON.parse(item.attr('subsidiaryvalue'))) != -1) {
                        $('.ZJSY').css('display', 'inline-block');
                        $('.ZJSY').find('span:eq(0)').css('color', 'red')
                    }

                }
            });
            $.each(subItemsControlsHide, function (index, item) {
                if (item.attr('mark') === "dialog") {
                    //弹窗
                    item.setRControlValue("")
                    $('#' + item.attr('subsidiaryid')).next().hide()
                } else {
                    //显示
                    if (item.parent().is('td')) {
                        item.parents('tr').hide();
                    } else {
                        item.parent().hide();
                    }
                    item.val("")
                    item.setRControlValue("")
                    if ($.inArray('32cb46e1-f9be-4eea-a12e-6a864f45c442', JSON.parse(item.attr('subsidiaryvalue'))) != -1) {
                        $('.ZJSY').css('display', 'none');
                    }

                }
            });
            if (subItemsControlsShow.length > 0 && subItemsControlsShow[0].attr('mark') === 'dialog') {
                //弹窗
                if (subItemsControlsShow.length < 6) {
                    dailog.find('.modal-content').css({
                        width: '470',
                        left: '34%',
                        top: '15%'
                    }); dailog.find('.modal-dialog').css({
                        width: '100%',
                        height: '100%'
                    });
                }
                dailog.modal('show');
            }
            return obj;
        },
        // 初始化主项从项相关
        initServant: function (className) {
            var obj = this,
                masterid = '',
                ary = []

            $(".formitems ").each(function () {
                var temp = $(this);
                ary.push({
                    id: temp.attr("id"),
                    value: temp.getRControlValue()
                });
            })

            $(".formitems ").each(function (i) {
                var item = $(this);

                var subsidiaryid = item.attr('subsidiaryid');
                var subsidiaryvalue = item.attr('subsidiaryvalue');

                if (!subsidiaryid || subsidiaryid == "") return;
                if (!subsidiaryvalue || subsidiaryvalue == "") return;
                subsidiaryvalue = JSON.parse(subsidiaryvalue);
                var SubsidiaryIsRequired = JSON.parse(item.attr('SubsidiaryIsRequired'));
                var SubsidiaryIconType = JSON.parse(item.attr('SubsidiaryIconType'));
                var flag = false;
                var flag2 = true;
                for (var i = 0, len = ary.length; i < len; i++) {
                    if (item.parent().is('td')) {
                        /////为了处理QC管理中的子控件关联问题
                        item.parents('tr').find('td:eq(0)').css('color', 'red')
                    } else {
                        item.parent().find('span').css('color', 'red')
                    }
                    if (subsidiaryid == ary[i].id) {

                        //SubsidiaryIsRequired=SubsidiaryIsRequired.split(',');
                        $.each(subsidiaryvalue, function (index, val) {
                            // 如果是数组
                            if (ary[i].value.isarray) {
                                for (var j = 0; j < ary[i].value.value.length; j++) {
                                    if ($.inArray(ary[i].value.value[j], subsidiaryvalue) != -1) {
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                            else {
                                if ($.inArray(ary[i].value.value, subsidiaryvalue) != -1) { // 如果不是数组
                                    if (SubsidiaryIsRequired[index] == "1") {
                                        item.attr('ismust', 'ismust').addClass('RInputText_must ')
                                        if (SubsidiaryIconType[index] == "ADR") {
                                            item.prev().html('<span class="adrIcon"></span>' + item.prev().text())
                                            flag2 = false;
                                        }
                                    }
                                    flag = true;
                                } else {
                                    if (SubsidiaryIsRequired[index] == "1") {
                                        flag2 = false;
                                        flag = true;
                                    }
                                }
                            }
                        })
                    }
                }
                if (flag2) {
                    if (flag == true && item.attr('mark') !== "dialog") {
                        if (item.parent().is('td')) {
                            item.parents('tr').css('display', 'table-row');
                        } else {
                            item.parent().show();
                        }

                        //$('.ZJSY').css('display', 'inline-block');
                        if ($('#EventOutcome').getRControlValue().value == '32cb46e1-f9be-4eea-a12e-6a864f45c442' && $.inArray('32cb46e1-f9be-4eea-a12e-6a864f45c442', JSON.parse(item.attr('subsidiaryvalue'))) != -1) {
                            $('.ZJSY').css('display', 'inline-block');
                            $('.ZJSY').find('span:eq(0)').css('color', 'red')
                        }
                    }
                    else {
                        if (item.parent().is('td')) {
                            item.parents('tr').hide();
                        } else {
                            item.parent().hide();
                        }
                        if (item.attr('mark') !== "dialog") {
                            item.val("")
                        }
                        //$('.ZJSY').css('display', 'none');
                    }
                }
            })
        }
    }
}

// 控件类
{
    // 控件类
    function InputControl(obj) {
        // 控件ID
        this.Id = obj["Id"];
        this.Mark = obj["Mark"];
        this.Name_chs = obj["Name_chs"];
        this.Name_eng = obj["Name_eng"];
        this.E2BColName = obj["E2BColName"];
        this.MaxLen = obj["MaxLen"];
        this.IsReadonly = obj["IsReadonly"];
        this.PageName = obj["PageName"];
        this.PvValue = obj["PvValue"];
        this.ADKey = obj["ADKey"];
        this.Format = "" + obj["Format"];
        if (this.Format.length > 0 && this.Format[0] == "$") this.Format = this.Format.substring(1);
        this.ControlType = obj["ControlType"];
        this.CodingType = obj["CodingType"];
        // 是否允许输入将来日期
        this.IsFutureDate = (obj["IsFutureDate"] != false);
        //
        this.IsAsObservationDataOfVisit = (obj["IsAsObservationDataOfVisit"] == true);
        //
        this.IsAsObservationDataOfCRF = (obj["IsAsObservationDataOfCRF"] == true);
        //
        this.IsAsObservationDataOfPatient = (obj["IsAsObservationDataOfPatient"] == true);

        // 附属控件ID
        this.SubsidiaryId = obj["SubsidiaryId"];
        // 附属控件触发条件值，多个值用逗号分割
        this.SubsidiaryValue = obj["SubsidiaryValue"];
        // 必填
        this.IsRequired = obj["IsRequired"] == "0" ? false : true;
        // 允许修改
        this.EnableUpdate = true;
        ////小图标类型
        this.IconType = obj["IconType"];
        ///触发联动或必填
        this.SubsidiaryIsRequired = isNull(obj["SubsidiaryIsRequired"]).split(',');
        //触发联动图标
        this.SubsidiaryIconType = obj["SubsidiaryIconType"];
        // 选择项值
        this.SelectItem = new Array();
        if (obj["SelectItem"] && obj["SelectItem"].length) {
            for (var i = 0; i < obj["SelectItem"].length; i++) {
                var selectItem = new SelectItem(obj["SelectItem"][i]);
                this.SelectItem.push(selectItem);
            }
        }
        //取字段内容值
        this.Values = new Array();
        if (obj["Values"] && obj["Values"].length) {
            for (var i = 0; i < obj["Values"].length; i++) {
                var value = new ControlValue(obj["Values"][i]);
                this.Values.push(value);
            }
        }
    }
    // 生成用于编辑的HTML代码
    // className: 生成的控件带有的className（用于后续操作），可不传，默认为"formItem"
    InputControl.prototype.MakeEditHtml = function (className) {
        var obj = this;
        if (obj.IsNullOrEmpty(className)) className = "formItem";
        className = " " + className;
        var controlstr = "";

        var id = (obj.IsNullOrEmpty(obj.Id) == true) ? "" : " id='" + obj.Id + "'";
        var oId = obj.Id;
        var codingType = obj.CodingType;
        var formid = " formid='" + obj.Id + "'";
        var SubsidiaryIsRequired = ' SubsidiaryIsRequired=' + JSON.stringify(obj.SubsidiaryIsRequired)
        var isMust = (obj.IsRequired == true) ? " ismust='ismust'" : "";
        var disabledClass = obj.IsReadonly == "1" ? ' disabled' : '';
        var regexp = (obj.IsNullOrEmpty(obj.RegExp) == true) ? "" : " regexp='" + obj.RegExp + "'";
        var SubsidiaryIconType = "";
        if (isNull(obj.SubsidiaryIconType) == "") {
            SubsidiaryIconType = ' SubsidiaryIconType="[]"'
        } else {
            SubsidiaryIconType = ' SubsidiaryIconType=' + JSON.stringify(obj.SubsidiaryIconType)
        }
        var subsidiaryid = (obj.IsNullOrEmpty(obj.SubsidiaryId)) ? "" : " subsidiaryid='" + obj.SubsidiaryId + "'";
        var subsidiaryvalue = (obj.IsNullOrEmpty(obj.SubsidiaryValue)) ? "" : " subsidiaryvalue='" + JSON.stringify(obj.SubsidiaryValue.split(',')) + "'";
        var mark = (obj.IsNullOrEmpty(obj.Mark)) ? "" : " mark='" + obj.Mark + "'";
        switch (obj.ControlType) {
            case 0:
                // 【单行文本(不限制)】
                controlstr += "<input" + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid + "itemId='" + obj.itemid() + "'"  + subsidiaryid + subsidiaryvalue + mark  + isMust + regexp + " class='type_rInputText" + className + disabledClass + "' type='text' value='' vId='" + obj.vId() + "' tabindex='1'/>";
                if (codingType == 1) {
                    controlstr += "<i id='" + oId + "' value='' class=\"fSize codeEditIcon iconInside drugBtn\" style='display: inline-block;cursor:pointer;position:relative;top:7px;right:-7px' title='编码' aria-hidden='true'></i>";
                }  
                else if (codingType == 2) {
                    controlstr += "<i  id='" + oId + "'itemId='" + obj.itemid() + "' value='' class=\"fSize codeEditIcon iconInside editCoding\"  style=\"display: inline-block;cursor:pointer;position:relative;top:7px;right:-12px\" title='编码' aria-hidden='true'></i>";
                }
                break;
            case 1:
                // 【单行文本(数字)】
                controlstr += "<input" + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue  + isMust+ regexp + " class='type_rInputText" + className + disabledClass + "' type='text' regexpreplace='^(([0-9]*)\\.?[0-9]*)$' value='' tabindex='1'/>";
                break;
            case 2:
                // 【多行文本】
                controlstr += "<textarea" + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue  + isMust  + " class='type_rTextarea" + className + disabledClass + "' tabindex='1'></textarea>";
                break;
            case 7:
                // 【日期】
                var isfuture = (obj.IsFutureDate) ? "" : " isfuture='false'";
                controlstr += "<div" + SubsidiaryIsRequired + SubsidiaryIconType + id + formid   + isMust + subsidiaryid + mark + subsidiaryvalue + isfuture + " class='type_rDatepicker" + className + disabledClass + "' tabindex='1' orderyear='desc' minyear='1915' maxyear='2040' lastvalue='" + obj.valueone() + "' format='{yyyyu}-{MMu}-{ddu}'></div>";
                break;
            case 3:
                // 【单选项】
                controlstr += "<div" + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue  + isMust + " class='type_rInputRadioGroup" + className + disabledClass + "' oldValue='" + JSON.stringify(obj.valueall()) + "' name='" + obj.Id + "'>";
                $.each(obj.SelectItem, function (i, selectItem) {
                        controlstr += '<label><input type="checkbox" class="radioCheckbox" value="'+selectItem.Id+'" />'+selectItem.Name+'</label>'
                });
                controlstr += "</div>";
                break;
            case 4:
                // 【多选项】
                controlstr += "<div" + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue  + isMust + " class='type_rInputCheckboxGroup" + className + disabledClass + "'  oldValue='" + JSON.stringify(obj.valueall()) + "' name='" + obj.Id + "'>";
                $.each(obj.SelectItem, function (i, selectItem) {
                        controlstr += '<label><input type="checkbox"  value="'+selectItem.Id+'" />'+selectItem.Name+'</label>'
                });
                controlstr += "</div>";
                break;
            case 5:
                ///select2（模糊查询） 下拉选项
                controlstr += "<select " + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue  + isMust + " class='select2_type " + className + disabledClass + "'  tabindex='1'>";
                    controlstr += "<option value=''>请选择</option>"
                $.each(obj.SelectItem, function (i, selectItem) {
                        controlstr += "<option value='" + selectItem.Id + "'>" + selectItem.Name + "</option>";
                });
                controlstr += "</select>";
                break;
            case 6:
                ///select2（没有模糊查询） 下拉选项
                controlstr += "<select " + SubsidiaryIsRequired + SubsidiaryIconType + id  + formid  + subsidiaryid + mark + subsidiaryvalue + isMust + " class='select3_type " + className + disabledClass + "'  tabindex='1'>";
                    controlstr += "<option value=''>请选择</option>"
                $.each(obj.SelectItem, function (i, selectItem) {
                        controlstr += "<option value='" + selectItem.Id + "'>" + selectItem.Name + "</option>";
                });
                controlstr += "</select>";
                break;
            case 7:
                ///富文本编辑框
        }
        return controlstr;
    }
    // 判断字符串是否为空
    InputControl.prototype.IsNullOrEmpty = function (str) {
        return (typeof (str) == "undefined" || str == null || str == "");
    }
    // 快速获取第一个itemId的值
    InputControl.prototype.itemid = function () {
        if (this.Values.length <= 0) return "";
        return this.Values[0].CustomInputValue;
    }
    // 快速获取第一个value的值
    InputControl.prototype.valueone = function () {
        if (this.Values.length <= 0) return "";
        return this.Values[0].Value;
    }
    // 快速获取多个value的值
    InputControl.prototype.valueall = function () {
        if (this.Values.length <= 0) return "";
        var arry = [];
        $.each(this.Values, function (i, n) {
            arry.push(n.Value)
        })
        return arry;
    }
    // 快速获取第一个Id的值
    InputControl.prototype.vId = function () {
        if (this.Values.length <= 0) return "";
        return this.Values[0].Id;
    }
    // 快速获取第一个IsCoded的值
    InputControl.prototype.IsCoded = function () {
        if (this.Values.length <= 0) return "";
        return this.Values[0].IsCoded;
    }
    // 快速获取第一个IsCoded的值
    InputControl.prototype.DrugCodedValue = function () {
        if (this.Values.length <= 0) return "";
        return this.Values[0].DrugCodedValue;
    }

    // 在选项中获取指定id的选项，若找不到则返回SelectItemNull
    InputControl.prototype.getSelectItemById = function (id) {
        for (var i = 0; i < this.SelectItem.length; i++) {
            if (this.SelectItem[i].Id == id) return this.SelectItem[i];
        }
        return SelectItemNull;
    }
}





