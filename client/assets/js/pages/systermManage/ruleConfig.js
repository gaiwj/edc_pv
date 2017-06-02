/**
 * Created by xiaoshuo.liu on 2017/5/26.
 */
$(function(){
    $('#ageCongigForm').bootstrapValidator();
})
/******年龄层配置*******/
var newAgeConfigFlag=false;
var currentAgeLineIndex=null
function initAgeConfigList(){
    $('#AgeConfigList').bootstrapTable({
        striped:true,
        clickToSelect:true,
        pagination:false,
        method:'get',
        sidePagination: "server",
        url:'/'+tms.urls.ageGroupController.ageGroupList,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        queryParamsType:'',
        columns:[
            {
                title:"年龄层",
                field:'agedescitemid',
                align:'center',
            },
            {
                title:"逻辑关系",
                align:'center',
                formatter:function(value,row,index){
                    if(row.agedescitemid=="45ff29d8-fe9f-4740-bb37-cc34c2f3e392"){
                        return '未出生'
                    }else{
                        var AgeUpperLimit="";
                        var AgeLowerLimit=row.agelowerlimit+(row.lowerunit)+"<"+(row.equallower==true?'=':'')+'年龄'
                        if(row.ageupperlimit!=0){
                            AgeUpperLimit='<'+(row.equalupper==true?'=':'')+row.ageupperlimit+(row.upperunit)
                        }
                        return AgeLowerLimit+AgeUpperLimit
                    }
                }
            },
            {
                title:"操作时间",
                field:'createtime',
                align:'center',
                formatter:function(value,row,index){
                    return getNormalDate(value)
                }
            },
            {
                title:"操作",
                align:'center',
                formatter:function(value,row,index){
                    return [
                        '<i class="glyphicon glyphicon-edit editAgeConfig" title="修改" data-toggle="modal" data-target="#ageConfigModal"></i>',
                        '<i class="glyphicon glyphicon-trash delAgeConfig" title="删除"></i>'
                    ].join('')
                },
                events:'ageConfigEvents'
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
                pageNumber:1,
                pageSize:20
            }
        },
    })
}
window.ageConfigEvents={
    'click .delAgeConfig':function(e,value,row,index){
        tms.confirm('确认删除',function(){
            tms.services.deleteAgeGroup({
                requestBody:{
                    agegroupid:row.calAgegroupId
                },
                callback:function(){
                    tms.alert('删除成功')
                    $('#AgeConfigList').bootstrapTable('refresh')
                }
            })
        })
    },
    'click .editAgeConfig':function(e,value,row,index){
        currentAgeLineIndex=index;
        newAgeConfigFlag=false;
        $('#ageCongigForm').attr('calAgegroupId',row.calAgegroupId)
        for(var key in row){
            tms.setFormValue('#ageCongigForm',key,row[key])
        }
    }
}
$('.addNewAgeConfig').click(function(){
    currentAgeLineIndex=null;
    newAgeConfigFlag=true;
    $('#ageCongigForm').attr('calAgegroupId',0)
    $('#ageCongigForm')[0].reset()
    $("#ageCongigForm").data('bootstrapValidator').resetForm();
})
$('.saveNewEditAgeConfig').click(function(){//保存新增修改年龄配置
    var vali=$('#ageCongigForm').data('bootstrapValidator')
    if (vali) {
        vali.validate();
        if (!vali.isValid()) {
            return false;
        }
    }
    var data={};
    var $formdata=$('#ageCongigForm').serializeArray();
    $.each($formdata,function(i,n){
        data[n.name]=n.value
    })
    $.extend(data,{
        'calAgegroupId':$('#ageCongigForm').attr('calAgegroupId'),
        'equallower':$('#equallower').is(':checked'),
        'equalupper':$('#equalupper').is(':checked'),
        'isdelete':false
    })
    var allData=$('#AgeConfigList').bootstrapTable('getData');
    if(allData.length>0){
        $.each(allData,function(i,n){
            if(i!=currentAgeLineIndex){
                if(data.agedescitemid == n.agedescitemid){
                    tms.alert('该年龄层已存在')
                    return false
                }
            }
        })
    }
    var AgeUpperLimit=transformAge(data.ageupperlimit,data.upperunit)
    var AgeLowerLimit=transformAge(data.agelowerlimit,data.lowerunit)
    if($.trim(data.agedescitemid)!="45ff29d8-fe9f-4740-bb37-cc34c2f3e392"){
        if(AgeLowerLimit>AgeUpperLimit||((!data.equallower||!data.equalupper)&&AgeLowerLimit==AgeUpperLimit)){////年龄上下线的大小
            tms.alert('年龄上限必须大于年龄下限')
            return false;
        }
    }
    if($.trim(data.agedescitemid)!="45ff29d8-fe9f-4740-bb37-cc34c2f3e392"){
        var flag=ageIsRight(data.agelowerlimit,data.lowerunit,data.equallower,data.ageupperlimit,data.upperunit,data.equalupper)
        if(flag===false){
            tms.alert('年龄范围冲突')
            return false;
        }
    }
        tms.services.saveAgeGroup({
            requestBody:data,
            callback:function(){
                if(newAgeConfigFlag) {
                    tms.alert('保存成功')
                }else{
                    tms.alert('修改成功')
                }
                closeModal();
                $('#AgeConfigList').bootstrapTable('refresh')
            }
        })


})
function transformAge(age,unit){///时间单位转换成小时
    switch (unit){
        case "59d7bedf-364a-11e7-b009-000c29ef8c08":///日
            return age*24
        case "59d720f1-364a-11e7-b009-000c29ef8c08":///月
            return age*30*24
        case "59d79f4d-364a-11e7-b009-000c29ef8c08":///岁
            return age*365*24
        case "3433bd7c-934b-40af-8315-cede87f0577d":///时
            return age
        case "d4dc1791-f3fd-47c1-b5b6-aab38bc2af83":///周
            return age*7*24
        case "a8858990-4679-4b6c-aba6-bfaf28f2248f":///十年
            return age*10*365*24
    }
}
function ageIsRight(lowerAge,lowerAgeUnit,equalLower,upperAge,upperAgeUnit,equalUpper){///判断当前填写年龄上下限是否冲突
    var curlowerAge=transformAge(lowerAge,lowerAgeUnit);
    var curupperAge=transformAge(upperAge,upperAgeUnit);
    var flag=true;
    $.each($('#AgeConfigList').bootstrapTable('getData'),function(i,n){
        if(currentAgeLineIndex!==i){
            var lage=transformAge(n.agelowerlimit,n.lowerunit)
            var uage=transformAge(n.ageupperlimit,n.upperunit)
            var elower=n.equallower;
            var eupper=n.equalupper;
            if(lage!=''){
                if(curlowerAge>=lage){
                    flag=false
                    return
                }
                if(curlowerAge<=lage&&(curupperAge>lage||(curupperAge==lage&&elower))){

                }
            }
            if(curlowerAge>lage&&curlowerAge<uage){
                flag=false
                return
            }
            if(curupperAge>lage&&curupperAge<uage){
                flag=false
                return
            }
            if(curlowerAge<lage&&curupperAge>uage){
                flag=false
                return
            }
            if(curlowerAge==lage&&curupperAge>uage&&!elower){
                flag=false
                return
            }
            if(curlowerAge<lage&&curupperAge==uage&&!eupper){
                flag=false
                return
            }

            if((equalLower&&elower&&curlowerAge==lage)||(equalLower&&eupper&&curlowerAge==uage)||(equalUpper&&eupper&&curupperAge==uage)||(equalUpper&&elower&&curupperAge==lage)){
                flag=false
                return
            }
        }

    })
    return flag
}
$('#agedescitemid').change(function(){//年龄层改变
    var value=$('#agedescitemid').val();
    if(value=="45ff29d8-fe9f-4740-bb37-cc34c2f3e392"){//胎儿
        $('#agelowerlimit,#ageupperlimit').val(0).attr('disabled','disabled')
        $('#lowerunit,#upperunit').val('59d79f4d-364a-11e7-b009-000c29ef8c08').attr('disabled','disabled')
        $('#equallower,#equalupper').iCheck('disable')
    }else{
        $('#agelowerlimit,#ageupperlimit,#lowerunit,#upperunit').val('').removeAttr('disabled')
        $('#equallower,#equalupper').iCheck('enable')
    }
})