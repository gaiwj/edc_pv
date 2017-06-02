/**
 * 首页
 */
$(function() {
    tms.services.getAllFieldsByCompany({
        requestBody: {
            companyId: "72012ed3-0a4f-45f8-ac16-f051a207895b",
            pageNumber: 1,
            pageSize:20
        },
        callback:function (res){
            //例子
            console.log(res);
        }
    });
});
