/**
 * Created by xiaoshuo.liu on 2017/5/10.
 */
var $researchList=null;
var $addNewFlag=false;
$(function(){
    initResearchList();
    $('#form').bootstrapValidator();
    /*初始化时间控件*/
    $('.timePicker').datetimepicker({
        format: 'YYYY-MM-DD',
        showTodayButton:true
    })
})
/*新增*/
$(document).on('click','.addNewResearch',function(){
    $addNewFlag=true;
    initDrugTable();
    setTimeout(function(){
        resetFormFun();
    },200)

})
function initDrugTable(){
    $('#drugTable').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
    })
}
function reloadResearchList(){
    $('#researchList').bootstrapTable('refresh')

}
/*初始化研究项目列表*/
function initResearchList(){
    $researchList=$('#researchList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pageNumber:1,
        pageSize:10,
        pagination:true,
        sidePagination: "server",
        method:'get',
        url:tms.urls.api_host+tms.urls.researchController.getResearchs,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                field :'itemnumber',
                title:'项目编号',
            },
            {
                field:'researchtopic',
                title:'研究方案名称',
            },
            {
                field:'medicationstudy',
                title:'其它研究用药'
            },
            {
                field:'researchtype',
                title:'临床研究分类'
            },
            {
                field:'researchtypedtlid',
                title:'研究类型细分'
            },
            {
                field:'drugids',
                title:'药物名称'
            },
            {
                field:'sponsor',
                title:'申办方'
            },
            {
                field:'studydesignid',
                title:'研究设计'
            },
            {
                field:'researchbegindate',
                title:'开始日期'
            },
            {
                field:'researchenddate',
                title:'结束日期'
            },
            {
                title:'操作',
                width:115,
                valign:'middle',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editResearch" title="修改" data-toggle="modal" data-target="#modalManual"></i>&nbsp;&nbsp;',
                        '<i class="glyphicon glyphicon-trash delResearch" data-toggle="tooltip" data-placement="top" title="删除"></i>'
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
window.actionsEvents={
    'click .editResearch':function(e,value,row,index){
        $addNewFlag=false;
            resetFormFun();
            for(var key in row){
                tms.setFormValue('#form',key,row[key])
            }
            $('#form').attr('lineId',row.id)
            initDrugTable()
    },
    'click .delResearch':function(e,value,row,index){
        var  id=row.id;
        delResearch(id);
    }
}

/* 保存新增*/
$(document).on('click','.saveNewResearch',function(){
    var vali=$('#form').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#form').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    if($addNewFlag){
        tms.services.addResearch({
            requestBody:$.extend(data,{
                drugids:['']
            }),
            callback:function(data){
                tms.alert('保存成功',function(){
                    reloadResearchList();
                    closeModal();
                })

            }
        })
    }else{
        tms.services.saveResearch({
            requestBody:$.extend(data,{
                drugids:[''],
                id:$('#form').attr('lineId')
            }),
            callback:function(data){
                tms.alert('修改成功',function(){
                    reloadResearchList();
                    closeModal()
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
}
/*删除*/
function delResearch(id){
    tms.confirm("确定删除？",function(){
        tms.services.deleteResearch({
            requestBody:{
                "id":id
            },
            callback:function(){
                tms.alert('删除成功')
                reloadResearchList();
            }
        })
    })

}
$('#modalManual').on('hide.bs.modal',function(){
    resetFormFun()
})