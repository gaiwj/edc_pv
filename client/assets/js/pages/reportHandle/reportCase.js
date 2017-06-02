/**
 * Created by xiaoshuo.liu on 2017/5/18.
 */
var $reportList=null
$(function(){
    /*初始化时间控件*/
    $('.timePicker').datetimepicker({
        format: 'YYYY-MM-DD',
        showTodayButton:true,
    })
    initReportList()
    $('#formCreatNewVersion').bootstrapValidator();
})
var searchData={
    // "adverseEvent": "",
    // "adverseEventBeginDate": "",
    // "adverseEventCode": "",
    // "adverseEventEndDate": "",
    // "adverseEventResult": "",
    // "brandName": "",
    // "causalityId": "",
    // "companyId": "",
    // "entInfo": "",
    "pageNumber":1,
    "pageSize":10,
    // "genericName": "",
    // "initialOrFollowup": "",
    // "isdelete": false,
    // "ishideImportReport": true,
    // "itemNumber": "",
    // "patientAge": "",
    // "patientBirthday": "",
    // "patientGender": "",
    // "patientName": "",
    // "ponderanceId": "",
    // "relateNumName": "",
    // "relateNumValue": "",
    // "reportDrugsafetyDateBegin": "",
    // "reportDrugsafetyDateEnd": "",
    // "reportReceiveDateBegin": "",
    // "reportReceiveDateEnd": "",
    // "reportStatus": "",
    // "reportType": "",
    // "reporterName": "",
    // "safetyreportid": "",
    // "version": ""
}
/******报告状态*******/
var reportStatus={//0数据录入中1数据质控中2医学评审中3复核提交中4报告提交中5报告已完成
    "0":'数据录入中',
    "1":'数据质控中',
    "2":'医学评审中',
    "3":'复核提交中',
    "4":'报告提交',
    "5":'报告已完成'
}
/*****个例报告列表*****/
function initReportList(){
    $reportList=$('#reportList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        columns:[
            {
                title:'报告编号',
                width:150,
                formatter:function(value,row,index){
                    var safetyreportid=row.safetyreportid;
                    if(row.version!=""&&row.version!=null){
                        safetyreportid=row.safetyreportid+'-'+row.version
                    }
                    return safetyreportid
                }
            },
            {
                title:'首次/随访报告',
                field:'initialFollow'
            },
            {
                title:'报告类型',
                field:'reportType'
            },
            {
                title:'严重性',
                field:'ponderanceName'
            },
            {
                title:'严重性标准',
                field:'severityOfTheStandard'
            },
            {
                title:'因果关系',
                field:'causalityId'
            },
            {
                title:'药物名称',
                field:'genericName'
            },
            {
                title:'不良事件',
                field:'blName'
            },
            {
                title:'收到报告日期',
                field:'reportReceiveDate',
                formatter:function(value,row,index){
                    return getNormalDate(value)
                }
            },
            {
                title:'PV部门获知日期',
                field:'reportDrugSafetyDate',
                formatter:function(value,row,index){
                    return getNormalDate(value)
                }
            },
            {
                title:'状态',//0数据录入中1数据质控中2医学评审中3复核提交中4报告提交中5报告已完成
                field:'reportStatus',
                width:80,
                formatter:function(value,row,index){
                    return reportStatus[value]
                }
            },
            {
                title:'当前所有人',
                field:'auditName'
            },
            {
                title:'操作',
                width:75,
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-book detailEntry"  title="详情"></i>&nbsp;&nbsp;',
                        '<div class="dropdown"  title="更多" style="width:20px;display:inline-block">' ,
                            '<i class="glyphicon glyphicon-download" data-toggle="dropdown" ></i>',
                            '<div class="dropdown-menu" role="menu" style="right:0;left:auto;min-width:85px">',
                                '<a href="javascript:;" class="glyphicon glyphicon-trash delReport" style="margin-left:0">删除</a>',
                                '<a href="javascript:;" class="glyphicon glyphicon-paste copyReport">复制</a>',
                                '<a href="javascript:;" class="glyphicon glyphicon-tasks CreatNewVersion" data-toggle="modal" data-target="#creatNewVersionDialog" >创建新版</a>',
                                '<a href="javascript:;" class="glyphicon glyphicon-import">导出</a>',
                                '<a href="" class="glyphicon glyphicon-save" target="_blank">中翻英</a>',
                                '<a href="" target="_blank"  class="glyphicon glyphicon-save">英翻中</a></div></div>'
                    ].join('')
                },
                events:"actionsEvents"
            },
        ],
        pageNumber:1,
        pageSize:10,
        pagination:true,
        sidePagination: "server",
        method:'post',
        url:'/'+tms.urls.reportController.searchReport,
        dataType: 'json',
        contentType: 'application/json',
        queryParamsType:'',
        onPageChange:function(number,size){
            $.extend(searchData,{
                "pageNumber":number,
                "pageSize":size
            })
        },
        responseHandler:function(json){
            var res = {
                rows: json.data.list,
                total: json.data.total,
            };
            return res;
        },
        queryParams: function (params) {
            return {
                pageNumber:params.pageNumber,
                pageSize:params.pageSize
            }
        },
        onLoadSuccess:function(){

        }
    })
}
window.actionsEvents={
    'click .copyReport':function(e,value,row,index){
        tms.confirm('是否要复制',function(){
            tms.services.copyReport({
                requestBody:{
                    sourceReportId:row.reportId
                },
                callback:function(data){
                    tms.alert('复制成功')
                    reloadReportList()
                }
            })
        })
    },
    'click .delReport':function(e,value,row,index){
        tms.confirm('是否要删除',function(){
            tms.services.deleteReport({
                requestBody:{
                    reportId:row.reportId
                },
                callback:function(data){
                    tms.alert('删除成功')
                    reloadReportList()
                }
            })
        })
    },
    'click .CreatNewVersion':function(e,value,row,index){
        $('#creatNewVersionDialog').attr('reportid',row.reportId)
    }
}
function reloadReportList(){
    $('#reportList').bootstrapTable('refresh')
}
/*****查询****/
$('.searchReport').click(function(){
    var formSearchArray=$('#formSearch').serializeArray();
    // $.each(formSearchArray,function(i,n){
    //     var obj={}
    //     obj[n.name]=n.value;
    //     $.extend(searchData,obj)
    // })
    // $.extend(searchData,{
    //     "isdelete":$('#isdelete').prop('checked'),
    //     "ishideImportReport":$('#ishideImportReport').prop('checked'),
    //     "safetyreportid":$('#safetyreportid').val().split('-')[0],
    //     "version":$('#safetyreportid').val().split('-').length>1?$('#safetyreportid').val().split('-')[1]:'',
    // })
    $('#reportList').bootstrapTable('refresh',{pageNumber:1})
    $('.panelTip').trigger('click')
})
///****重置搜索****/
$('.resetSearchReport').click(function(){
    $('#formSearch')[0].reset();
    $('.select2').change();
    $('#isdelete').iCheck('check').iCheck('uncheck')
})
$('.panelTip').click(function(){
    $('.searchPanel').stop(false,true).slideToggle('normal',function(){
        $('.panelTip .down').toggle();
        $('.panelTip .up').toggle()
    });
})
/******点击隐藏导入报告********/
$('#ishideImportReport').change(function(){
    // $.extend(searchData,{
    //     "ishideImportReport":$('#ishideImportReport').prop('checked'),
    // })
})
/******保存创建新版本****/
$('.saveNewVersion').click(function(){
    var vali=$('#formCreatNewVersion').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data=getFormObjDate('formCreatNewVersion')
    tms.services.createVerion({
        requestBody:$.extend(data,{
            sourceReportId:$('#creatNewVersionDialog').attr('reportid')
        }),
        callback:function(json){
            tms.alert('创建成功，编号为：'+json.data)
            closeModal()
            reloadReportList()
        }
    })
})
/***相关编号***/
$('#relateNumName').change(function(){
    var value=$('#relateNumName').val();
    if(value==""){
        $('#relateNumValue').attr({'placeholder':'请先选择相关编号','readonly':'readonly'}).val('')
    }else{
        $('#relateNumValue').removeAttr('placeholder').removeAttr('readonly')
    }
})