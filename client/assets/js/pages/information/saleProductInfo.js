/**
 * Created by xiaoshuo.liu on 2017/5/10.
 */
var $productInfoList=null;
var $AElist=null;
var $addNewFlag=false;
var $addNewAE=false;
$(function(){
    initProductList();
    $('#form').bootstrapValidator();
    $('#AEform').bootstrapValidator();
    /*初始化时间控件*/
    $('.timePicker').datetimepicker({
        format: 'YYYY-MM-DD',
        showTodayButton:true
    })
})
/*新增*/
$(document).on('click','.addNewProduct',function(){
    $addNewFlag=true;
    initFileTable();
   setTimeout(function(){
       resetFormFun()
   },200)
})
function initFileTable(){
    $('#fileTable').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
    })
}
function reloadProductList(){
    $('#productInfoList').bootstrapTable('refresh')
}
function reloadAEList(){
    getAElist($('#AEform').attr('AEId'))
}
/*初始化产品列表*/
function initProductList(){
    $productInfoList=$('#productInfoList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pageNumber:1,
        pageSize:10,
        pagination:true,
        sidePagination: "server",
        method:'get',
        url:tms.urls.api_host+tms.urls.psurDrugController.getSalePsurDrug,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                field :'genericnamecn',
                title:'通用名称',
            },
            {
                field:'productnamecn',
                title:'商品名称',
            },
            {
                field:'approvalnumber',
                title:'批准文号'
            },
            {
                field:'regdate',
                title:'注册时间'
            },
            {
                field:'dosageform',
                title:'剂型'
            },
            {
                field:'spec',
                title:'规格'
            },
            {
                field:'psurdrugtype',
                title:'药品分类'
            },
            {
                field:'activeingredient',
                title:'活性成分'
            },
            {
                field:'manufacturer',
                title:'生产厂家名称'
            },
            {
                field:'domesticorimported',
                title:'国产/进口'
            },
            {
                title:'不良反应',
                valign:'middle',
                formatter:function(){
                    return[
                        '<a href="jsvascript:" class="AElink">不良反应</a>'
                    ].join('')
                },
                events:'actionsEvents'
            },
            {
                title:'操作',
                width:115,
                valign:'middle',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editProduct" title="修改" data-toggle="modal" data-target="#modalManual" ></i>&nbsp;&nbsp;',
                        '<i class="glyphicon glyphicon-trash delProduct" title="删除"></i>'
                    ].join('')
                },
                events:'actionsEvents'
            }
        ],
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
    })
}
/*初始化不良反应列表*/
function initAElist(){
    $AElist=$('#AEList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        columns:[
            {
                title:'序号',
                formatter:function(value,row,index){
                    return index+1
                }
            },
            {
                title:'不良反应名称',
                field:'name'
            },
            {
                title:'首选术语',
                field:'ptname'
            },
            {
                title:'发生率',
                field:'adversetype'
            },
            {
                title:'备注',
                field:'mark'
            },
            {
                title: '操作',
                width: 115,
                valign: 'middle',
                formatter: function (value, row, index) {
                    return [
                        '<i class="glyphicon glyphicon-edit editAE"  data-toggle="modal" data-target="#AEmodal" title="修改"></i>&nbsp;&nbsp;',
                        '<i class="glyphicon glyphicon-trash delAE" title="删除"></i>'
                    ].join('')
                },
                events:AEactionsEvents
            }
        ]
    })
}
window.actionsEvents={
    'click .editProduct':function(e,value,row,index){
        $addNewFlag=false;
        for(var key in row){
            tms.setFormValue('#form',key,row[key])
        }
        $('#form').attr('lineId',row.id)
        initFileTable()
    },
    'click .delProduct':function(e,value,row,index){
        var  id=row.id;
        delProduct(id);
    },
    'click .AElink':function(e,value,row,index){
        $('.productPanel').hide();
        $('.AEpanel').show();
        initAElist();
        $('#AEform').attr('AEId',row.id)
        getAElist(row.id)
    }
}
/**加载不良反应列表**/
function getAElist(id){
    tms.services.getPsurDrugAdverseEventsByPsurDrugId({
        requestBody:{
            psurDrugId:id
        },
        callback:function(json){
            $AElist.bootstrapTable('load',json.data)
        }
    })
}
window.AEactionsEvents={
    'click .editAE':function(e,value,row,index){
        resetFormFun();
        $('#AEform').attr('AElineId',row.id)
        $addNewAE=false;
        for(var key in row){
            tms.setFormValue('#AEform',key,row[key])
        }
    },
    'click .delAE':function(e,value,row,index){
        delAE(row.id)
    }
}
$('#modalManual').on('hide.bs.modal',function(){
    resetFormFun();
})
/* 保存新增*/
$(document).on('click','.saveNewProduct',function(){
    var vali=$('#form').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#form').serializeArray();
    var $formMedicaldata=$('#formMedical').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    $.each($formMedicaldata,function(i,n){
        data[n.name]=n.value
    })
    if($addNewFlag){
        tms.services.addSalePsurDrug({
            requestBody:$.extend(data,{
                filelist:''
            }),
            callback:function(data){
                tms.alert('保存成功',function(){
                    reloadProductList();
                    closeModal();
                    resetFormFun();
                })

            }
        })
    }else{
        tms.services.saveSalePsurDrug({
            requestBody:$.extend(data,{
                filelist:'',
                id:$('#form').attr('lineId')
            }),
            callback:function(data){
                tms.alert('修改成功',function(){
                    reloadProductList();
                    closeModal()
                    resetFormFun();
                })
            }
        })
    }
})
/*重置表单*/
function resetFormFun(){
    $('#form')[0].reset();
    $('.select2').change();
    $("#form").data('bootstrapValidator').resetForm();
    $('#formMedical')[0].reset();
    $('input').iCheck('check').iCheck('uncheck')
    $('#AEform')[0].reset();
    $("#AEform").data('bootstrapValidator').resetForm();
}
/*删除*/
function delProduct(id){
    tms.confirm("确定删除？",function(){
        tms.services.deletePsurDrug({
            requestBody:{
                "id":id
            },
            callback:function(){
                tms.alert('删除成功')
                reloadProductList();
            }
        })
    })

}
/*返回*/
$('.returnProductList').click(function () {
    $('.productPanel').show();
    $('.AEpanel').hide();
})
/*新增不良事件*/
$(document).on('click','.addAE',function(){
    $addNewAE=true;
    setTimeout(function(){
        resetFormFun()
    },200)
})
/*保存新增修改不良事件*/
$(document).on('click','.saveNewAE',function(){
    var vali=$('#AEform').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $AEformdata=$('#AEform').serializeArray();
    $.each($AEformdata,function(i,n){
        data[n.name]=n.value;
    })
    if($addNewAE){
        tms.services.addPsurDrugAdverseEvent({
            requestBody:$.extend(data,{psurdrugid:$('#AEform').attr('AEId')}),
            callback:function(data){
                tms.alert('保存成功')
                reloadAEList()
                closeModal();
                resetFormFun();
            }
        })
    }else{
        tms.services.savePsurDrugAdverseEvent({
            requestBody:$.extend(data,{id:$('#AEform').attr('AElineId')}),
            callback:function(data){
                tms.alert('保存成功')
                reloadAEList()
                closeModal();
                resetFormFun();
            }
        })
    }
})
/***删除不良事件**/
function delAE(id){
    tms.confirm("确定删除？",function(){
        tms.services.deletePsurDrugAdverseEvent({
            requestBody:{
                "id":id
            },
            callback:function(){
                tms.alert('删除成功')
                reloadAEList();
            }
        })
    })

}