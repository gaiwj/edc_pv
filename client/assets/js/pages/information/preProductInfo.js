/**
 * Created by xiaoshuo.liu on 2017/5/3.
 */
var $productInfoList=null;
var $addNewFlag=false;
$(function(){
    initProductList();
    $('#form').bootstrapValidator();
    /**剂型**/
    $('#DosageFormName').select2({
        minimumResultsForSearch: 1,
        width: "100%",
        placeholder:'请选择',
    })
})
$('#modalManual').on('hide.bs.modal',function(){
    resetFormFun();
})
function initProductList(){
    $productInfoList=$('#productInfoList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pageNumber:1,
        pageSize:10,
        pagination:true,
        sidePagination: "server",
        method:'get',
        url:tms.urls.api_host+tms.urls.psurDrugController.getPrePsurDrugs,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                title:'序号',
                formatter:function(value,row,index){
                   return index+1
                }
            },
            {
                field :'genericnamecn',
                title:'通用名称(中文)',
                width:300
            },
            {
                field:'genericnameeng',
                title:'通用名称(英文)',
                width:300
            },
            {
                field:'activeingredient',
                title:'活性成份'
            },
            {
                field:'psurdrugtype',
                title:'药品分类'
            },
            {
                field:'manufacturer',
                title:'生产厂家名称',
                width:200
            },
            {
                field:'dosageform',
                title:'剂型'
            },{
                title:'操作',
                width:115,
                valign:'middle',
                formatter:function(value,row,index){
                    return [
                        '<i  class="glyphicon glyphicon-edit editProduct" title="修改"  data-toggle="modal" data-target="#modalManual"></i>&nbsp;&nbsp;',
                        '<i  class="glyphicon glyphicon-trash delProduct" title="删除"></i>'
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
            console.info(params)
            return {
                pageNumber:params.pageNumber,
                pageSize:params.pageSize
            }
        },
    })
}
window.actionsEvents={
    'click .editProduct':function(e,value,row,index){
        $addNewFlag=false;
        $('#GenericName').val(row.genericnamecn)
        $('#GenericNameEng').val(row.genericnameeng)
        $('#ActiveIngredient').val(row.activeingredient)
        $('#drugClass').val(row.psurdrugtype).change();
        $('#Manufacturer').val(row.manufacturer)
        $('#DosageFormName').val(row.dosageform).change();
        $('#form').attr('lineId',row.id)
        initFileTable()
    },
    'click .delProduct':function(e,value,row,index){
        var  id=row.id;
        delProduct(id);
    }
}
/*新增*/
$(document).on('click','.addNewProduct',function(){
    $addNewFlag=true;
    initFileTable();
    setTimeout(function(){
        resetFormFun();
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
/* 保存新增*/
$(document).on('click','.saveNewProduct',function(){
    var vali=$('#form').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    if($addNewFlag){
        tms.services.addPrePsurDrug({
            requestBody:{
                "activeingredient": $('#ActiveIngredient').val(),
                "dosageform": $('#DosageFormName').val(),
                "filelist": "",
                "genericnamecn": $('#GenericName').val(),
                "genericnameeng": $('#GenericNameEng').val(),
                "manufacturer": $('#Manufacturer').val(),
                "psurdrugtype": $('#drugClass').val()
            },
        callback:function(data){
            tms.alert('保存成功',function(){
                reloadProductList();
                closeModal();
                resetFormFun();
                })

        }
        })
    }else{
        tms.services.savePrePsurDrug({
            requestBody:{
                "activeingredient": $('#ActiveIngredient').val(),
                "dosageform": $('#DosageFormName').val(),
                "filelist": "",
                "genericnamecn": $('#GenericName').val(),
                "genericnameeng": $('#GenericNameEng').val(),
                "manufacturer": $('#Manufacturer').val(),
                "psurdrugtype": $('#drugClass').val(),
                "id":$('#form').attr('lineId')
            },
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
    $('#form').data('bootstrapValidator').resetForm();
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
                initProductList();
            }
        })
    })

}