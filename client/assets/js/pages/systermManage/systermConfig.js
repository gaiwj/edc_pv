/**
 * Created by xiaoshuo.liu on 2017/5/23.
 */
$(function(){
    $('#formTabPages').bootstrapValidator();//tab页配置
    $('#formMenu').bootstrapValidator();//一级菜单配置
    $('#secondFormMenu').bootstrapValidator();//二级菜单配置
    initSecondMenuList()/////初始化菜单配置二级菜单
})
/*****页面管理/tab页******/
function initTabPageList(){
    $('#tabPageList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        pageNumber:1,
        pageSize:20,
        method:'get',
        sidePagination: "server",
        url:'/'+tms.urls.pagesConfigController.getCurrCompanyPages,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                title:"序号",
                field:'sortindex',
                align:'center',
            },
            {
                title:"中文名",
                field:'nameChs',
                align:'center',
            },
            {
                title:"英文名",
                field:'nameEng',
                align:'center',
            },
            {
                title:"操作",
                align:'center',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editTabPage" title="修改" data-toggle="modal" data-target="#tabPageModal"></i>&nbsp;&nbsp;',
                        '<i class="glyphicon glyphicon-trash delTabPage" title="删除"></i>'
                    ].join('')
                },
                events:'TabPageEvents'
            }
        ],
        responseHandler:function(json){
            var res = {
                rows: json.data.list,
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
window.TabPageEvents={
    'click .delTabPage':function(e,value,row,index){
        tms.confirm('确认删除？',function(){
            tms.services.deletePagesById({
                requestBody:{
                    pagesId:row.id
                },
                callback:function(){
                    tms.alert('删除成功')
                    $('#tabPageList').bootstrapTable('refresh')
                }
            })
        })
    },
    'click .editTabPage':function(e,value,row,index){
        $('#formTabPages').attr('lineId',row.id)
        for(var key in row){
            tms.setFormValue('#formTabPages',key,row[key])
        }
    }
}
/******修改页面管理/tab页*****/
$('.saveTabPages').click(function(){
    var vali=$('#formTabPages').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#formTabPages').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    tms.services.updatePagesByDto({
        requestBody:$.extend(data,{
            id:$('#formTabPages').attr('lineId')
        }),
        callback:function(){
            tms.alert('修改成功')
            closeModal();
            $('#tabPageList').bootstrapTable('refresh')
        }
    })
})
/*****菜单配置*****/
var $newMenuFlag=false;
var $newSecondMenuFlag=false;
function initMenuList(){
    $('#menuList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        method:'get',
        sidePagination: "server",
        url:'/'+tms.urls.menuConfigController.getCurrCompanyMenu,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                title:"序号",
                field:'seq',
                align:'center',
            },
            {
                title:"中文名",
                field:'nameChs',
                align:'center',
            },
            {
                title:"英文名",
                field:'nameEng',
                align:'center',
            },
            {
                title:"路径",
                field:'url',
                align:'center',
            },
            {
                title:"当前位置",
                field:'parameter',
                align:'center',
            },
            {
                title:"操作",
                align:'center',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editMenu" title="修改" data-toggle="modal" data-target="#menuModal"></i>',
                        '<i class="glyphicon glyphicon-trash delMenu" title="删除"></i>',
                        '<i class="fa fa-bars getSecondMenu" aria-hidden="true" title="二级菜单"></i>'
                    ].join('')
                },
                events:'menuListEvents'
            }
        ],
        responseHandler:function(json){
            var res = {
                rows: json.data.list,
            };
            return res;
        },
        queryParams: function () {
            return {
                pageNumber:1,
                pageSize:20
            }
        },
    })
}
function initSecondMenuList(){/////初始化二级菜单
    $('#secondMenuList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        columns:[
            {
                title:"序号",
                field:'seq',
                align:'center',
            },
            {
                title:"中文名",
                field:'nameChs',
                align:'center',
            },
            {
                title:"英文名",
                field:'nameEng',
                align:'center',
            },
            {
                title:"路径",
                field:'url',
                align:'center',
            },
            {
                title:"当前位置",
                field:'parameter',
                align:'center',
            },
            {
                title:"操作",
                align:'center',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editSecondMenu" title="修改" data-toggle="modal" data-target="#secondMenuModal"></i>',
                        '<i class="glyphicon glyphicon-trash delSecondMenu" title="删除"></i>'
                    ].join('')
                },
                events:'secondMenuListEvents'
            }
        ],
    })
}
window.secondMenuListEvents={
    'click .editSecondMenu':function(e,value,row,index){
        $newSecondMenuFlag=false;
        $('#secondFormMenu').attr('lineId',row.id)
        for(var key in row){
            tms.setFormValue('#secondFormMenu',key,row[key])
        }
    },
    'click .delSecondMenu':function(e,value,row,index){
        tms.confirm('确认删除？',function(){
            tms.services.deleteMenuDtlById({
                requestBody:{
                    menuDtlId:row.id
                },
                callback:function(){
                    tms.alert('删除成功')
                    getScondMenuList($('#secondMenuModal').attr('parentMenu'))
                }
            })
        })
    }
}
window.menuListEvents={
    'click .editMenu':function(e,value,row,index){
        $newMenuFlag=false;
        $('#formMenu').attr('lineId',row.id)
        for(var key in row){
            tms.setFormValue('#formMenu',key,row[key])
        }
    },
    'click .delMenu':function(e,value,row,index){
        tms.confirm('确认删除？',function(){
            tms.services.deleteMenuById({
                requestBody:{
                    menuId:row.id
                },
                callback:function(){
                    tms.alert('删除成功')
                    $('#menuList').bootstrapTable('refresh')
                }
            })
        })
    },
    'click .getSecondMenu':function(e,value,row,index){
        getScondMenuList(row.id)
        $('#secondMenuModal').attr('parentMenu',row.id)
        $('.secondMenuListBox').show()
        $('.menuListBox').hide()
    }
}
function getScondMenuList(menuId){/***获取二级菜单***/
    tms.services.getCurrCompanyMenuDtlByMenu({
        requestBody:{
            '测试用ID，为系统配置的菜单ID':menuId,
            pageSize:1,
            pageNumber:20
        },
        callback:function(json){
            $('#secondMenuList').bootstrapTable('load',json.data.list)
        }
    })
}
$('.addNewMenu').click(function(){
    $newMenuFlag=true
    $('#formMenu')[0].reset();
    $("#formMenu").data('bootstrapValidator').resetForm();
})
$('.addNewSecondMenu').click(function(){
    $newSecondMenuFlag=true
    $('#secondFormMenu')[0].reset();
    $("#secondFormMenu").data('bootstrapValidator').resetForm();
})
$('.returnMenu').click(function(){///返回一级菜单
    $('.secondMenuListBox').hide()
    $('.menuListBox').show()
})
$('.saveNewEditMenu').click(function(){//保存一级菜单
    var vali=$('#formMenu').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#formMenu').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    if($newMenuFlag){
        tms.services.addMenuByDto({
            requestBody:$.extend(data,{
                isdelete:false
            }),
            callback:function(){
                tms.alert('保存成功')
                closeModal();
                $('#menuList').bootstrapTable('refresh')
            }
        })
    }else{
        tms.services.updateMenuByDto({
            requestBody:$.extend(data,{
                id:$('#formMenu').attr('lineId'),
                isdelete:false
            }),
            callback:function(){
                tms.alert('修改成功')
                closeModal();
                $('#menuList').bootstrapTable('refresh')
            }
        })
    }
})
$('.saveNewEditSecondMenu').click(function(){//保存二级菜单
    var vali=$('#secondFormMenu').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#secondFormMenu').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    if($newSecondMenuFlag){
        tms.services.addMenuDtlByDto({
            requestBody:$.extend(data,{
                menuid:$('#secondMenuModal').attr('parentMenu'),
                isdelete:false
            }),
            callback:function(){
                tms.alert('保存成功')
                closeModal();
                getScondMenuList($('#secondMenuModal').attr('parentMenu'))
            }
        })
    }else{
        tms.services.updateMenuDtlByDto({
            requestBody:$.extend(data,{
                id:$('#secondFormMenu').attr('lineId'),
                isdelete:false
            }),
            callback:function(){
                tms.alert('修改成功')
                closeModal();
                getScondMenuList($('#secondMenuModal').attr('parentMenu'))
            }
        })
    }
})
/***********基础行管理***********/
function initBaseLineListing(){
    $('#BaseLineListing').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        method:'get',
        sidePagination: "server",
        url:'/'+tms.urls.menuConfigController.getCurrCompanyMenu,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                title:"序号",
                field:'seq',
                align:'center',
            },
            {
                title:"中文名",
                field:'nameChs',
                align:'center',
            },
            {
                title:"英文名",
                field:'nameEng',
                align:'center',
            },
            {
                title:"路径",
                field:'url',
                align:'center',
            },
            {
                title:"当前位置",
                field:'parameter',
                align:'center',
            },
            {
                title:"操作",
                align:'center',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editBaseLineListing" title="修改" data-toggle="modal" data-target="#menuModal"></i>',
                        '<i class="glyphicon glyphicon-trash delBaseLineListing" title="删除"></i>'
                    ].join('')
                },
                events:'BaseLineListingEvents'
            }
        ],
        responseHandler:function(json){
            var res = {
                rows: json.data.list,
            };
            return res;
        },
        queryParams: function () {
            return {
                pageNumber:1,
                pageSize:20
            }
        },
    })
}
window.BaseLineListingEvents={
    'click .editBaseLineListing':function(){

    },
    'click .delBaseLineListing':function(){

    }
}




