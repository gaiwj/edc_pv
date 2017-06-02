/**
 * @return {[type]} 接口 tms.services.oper
 */
var tms = tms || {};
(function($) {
    //接口命名空间
    var me = this;
    me.services = me.services || {};
    var ajax_host = "/";

    //查询公司拥有的所有字段
    this.services.getAllFieldsByCompany = function (params) {
        ajaxSend.get(params, ajax_host + me.urls.fieldConfig.getAllFieldsByCompany);
    };
    /****** 信息维护********/
    {
        //当前公司下的上市前产品信息
        this.services.getPrePsurDrugs = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.psurDrugController.getPrePsurDrugs);
        };
        //新增上市前产品信息
        this.services.addPrePsurDrug = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.psurDrugController.addPrePsurDrug);
        };
        //更新上市前产品信息
        this.services.savePrePsurDrug = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.psurDrugController.savePrePsurDrug);
        };
        //删除上市前上市后产品信息
        this.services.deletePsurDrug = function (params) {
            ajaxSend.delete(params, ajax_host + me.urls.psurDrugController.deletePsurDrug);
        };
        //新增上市后产品信息
        this.services.addSalePsurDrug = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.psurDrugController.addSalePsurDrug);
        };
        //更新上市后产品信息
        this.services.saveSalePsurDrug = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.psurDrugController.saveSalePsurDrug);
        };
        //获取上市后产品信息里关联的不良反应列表
        this.services.getPsurDrugAdverseEventsByPsurDrugId = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.psurDrugController.getPsurDrugAdverseEventsByPsurDrugId);
        };
        //新增上市后药品信息里关联的不良反应
        this.services.addPsurDrugAdverseEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.psurDrugController.addPsurDrugAdverseEvent);
        };
        //更新上市后产品信息不良反应
        this.services.savePsurDrugAdverseEvent = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.psurDrugController.savePsurDrugAdverseEvent);
        };
        //删除上市后产品信息不良反应
        this.services.deletePsurDrugAdverseEvent = function (params) {
            ajaxSend.delete(params, ajax_host + me.urls.psurDrugController.deletePsurDrugAdverseEvent);
        };
        //获取当前公司下的所有研究项目
        this.services.getResearchs = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.researchController.getResearchs);
        };
        //新增研究项目和研究项目关联的产品
        this.services.addResearch = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.researchController.addResearch);
        };
        //更新研究项目
        this.services.saveResearch = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.researchController.saveResearch);
        };
        //删除研究项目
        this.services.deleteResearch = function (params) {
            ajaxSend.delete(params, ajax_host + me.urls.researchController.deleteResearch);
        };
    }
    {
        //查询报告列表
        this.services.searchReport = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.reportController.searchReport);
        };
        //复制报告
        this.services.copyReport = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.reportController.copyReport);
        };
        //创建新版本
        this.services.createVerion = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.reportController.createVerion);
        };
        //删除报告
        this.services.deleteReport = function (params) {
            ajaxSend.delete(params, ajax_host + me.urls.reportController.deleteReport);
        };
        //获取报告
        this.services.getReport = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.reportController.getReport);
        };
        //复制报告
        this.services.addReport = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.reportController.addReport);
        };
    }
    {///后台个例报告Tab页配置
        //根据Id，删除Tab页
        this.services.deletePagesById = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.pagesConfigController.deletePagesById);
        };
        //根据Dto修改当前Tab页
        this.services.updatePagesByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.pagesConfigController.updatePagesByDto);
        };
    }
    {///菜单配置（包括二级菜单）
        //新增一级菜单
        this.services.addMenuByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.menuConfigController.addMenuByDto);
        };
        //新增二级菜单
        this.services.addMenuDtlByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.menuConfigController.addMenuDtlByDto);
        };
        //删除一级菜单
        this.services.deleteMenuById = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.menuConfigController.deleteMenuById);
        };
        //删除二级菜单
        this.services.deleteMenuDtlById = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.menuConfigController.deleteMenuDtlById);
        };
        //修改一级菜单
        this.services.updateMenuByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.menuConfigController.updateMenuByDto);
        };
        //修改二级菜单
        this.services.updateMenuDtlByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.menuConfigController.updateMenuDtlByDto);
        };
        //根据一级菜单ID，查询二级菜单
        this.services.getCurrCompanyMenuDtlByMenu = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.menuConfigController.getCurrCompanyMenuDtlByMenu);
        };
    }
    {//年龄层配置规则
        //查询本公司所有年龄配置
        this.services.ageGroupList = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ageGroupController.ageGroupList);
        };
        //获取年龄层字典
        this.services.ageGroupSelectItem = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ageGroupController.ageGroupSelectItem);
        };
        //获取年龄单位字典
        this.services.ageUnit = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ageGroupController.ageUnit);
        };
        //删除年龄配置
        this.services.deleteAgeGroup = function (params) {
            ajaxSend.delete(params, ajax_host + me.urls.ageGroupController.deleteAgeGroup);
        };
        //保存年龄配置
        this.services.saveAgeGroup = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.ageGroupController.saveAgeGroup);
        };
    }
    {/// 基础行配置
        //根据ID，删除基础行数据
        this.services.deleteBaseLineListingByID = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.baseLineListingConfigController.deleteBaseLineListingByID);
        };
        //根据PagesId，获取当前公司的基础行
        this.services.getBaseLineListingByPageId = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.baseLineListingConfigController.getBaseLineListingByPageId);
        };
        //获取当前公司的基础行条数
        this.services.getBaseLineListingCount = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.baseLineListingConfigController.getBaseLineListingCount);
        };
        //获取当前公司，所有基础行数据（不分页）
        this.services.getBaseLineListingWithoutPageInfo = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.baseLineListingConfigController.getBaseLineListingWithoutPageInfo);
        };
        //获取当前公司的基础行数据
        this.services.getCurrCompanyBaseLineListing = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.baseLineListingConfigController.getCurrCompanyBaseLineListing);
        };
        //初始化当前公司的基础行数据
        this.services.initBaseLineListing = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.baseLineListingConfigController.initBaseLineListing);
        };
        //根据ID，更新基础行数据
        this.services.updateBaseLineListingByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.baseLineListingConfigController.updateBaseLineListingByDto);
        };
    }
    {//// 事件描述配置
        ////删除事件描述详情配置
        this.services.DeleteConfigEventField = function (params) {
            ajaxSend.put(params, ajax_host + me.urls.configEventController.DeleteConfigEventField);
        };
    }
    {//因果评分配置
        ////新增因果评分
        this.services.addEvaluationCriterionByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.evaluationCriterionConfigController.addEvaluationCriterionByDto);
        };
        ////删除因果评分
        this.services.deleteEvaluationCriterionById = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.evaluationCriterionConfigController.deleteEvaluationCriterionById);
        };
        ////获取因果评分
        this.services.getAllEvaluationCriterion = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.evaluationCriterionConfigController.getAllEvaluationCriterion);
        };
        ////修改因果评分
        this.services.updateEvaluationCriterionByDto = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.evaluationCriterionConfigController.updateEvaluationCriterionByDto);
        };
    }

}).call(tms, jQuery);