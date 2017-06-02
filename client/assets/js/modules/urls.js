/**
 * @return {[type]} 接口url:tms.activeUrl.oper
 */
var tms = tms || {};
(function(factory) {
    if (typeof module !== 'undefined') {
        module.exports = factory();
    } else {
        tms.urls = factory();
        //window.urls = factory();
    }
}(function() {
    var urls = {
        api_host:"http://192.168.1.207:9080/PV-1.0-SNAPSHOT/",
        //api_host:"http://192.168.101.134:8080/",
        fieldConfig:{
          getAllFieldsByCompany:"fieldConfig/getAllFieldsByCompany",
        },
        user:{
            userLogin:"User/UserLogin",
            getCompanies: "User/GetCompanies",
            loginCompany: "User/LoginCompany",
            getUser:"User/GetUser",
            getProjects:"User/GetProjects"
        },
        psurDrugController:{/// 产品信息
            addPrePsurDrug:"psurDrug/addPrePsurDrug",//新增上市前产品信xi
            getPrePsurDrugs:"psurDrug/getPrePsurDrugs",//当前公司下的上市前产品信息
            getPsurDrugs:"psurDrug/getPsurDrugs",//查询所有的产品信息
            getPsurDrugsByPage:"psurDrug/getPsurDrugsByPage",//根据分页查询所有的产品信息
            getPsurDrugsByResearchId:"psurDrug/getPsurDrugsByResearchId",//根据研究项目获取产品信息列表
            savePrePsurDrug:"psurDrug/savePrePsurDrug",//更新上市前产品信息
            addSalePsurDrug:"psurDrug/addSalePsurDrug",//新增上市后产品信息
            addPsurDrugAdverseEvent:"psurDrug/addPsurDrugAdverseEvent",//新增上市后药品信息里关联的不良反应
            getSalePsurDrug:"psurDrug/getSalePsurDrugs",///获取上市后产品信息
            getPsurDrugAdverseEventsByPsurDrugId:"psurDrug/getPsurDrugAdverseEventsByPsurDrugId",//获取上市后产品信息里关联的不良反应列表
            saveSalePsurDrug:"psurDrug/saveSalePsurDrug",//更新上市后产品信息
            savePsurDrugAdverseEvent:"psurDrug/savePsurDrugAdverseEvent",//更新上市后产品信息不良反应
            deletePsurDrug:"psurDrug/deletePsurDrug",//删除产品信息
            deletePsurDrugAdverseEvent:"psurDrug/deletePsurDrugAdverseEvent",//删除上市后产品信息不良反应
        },
        researchController:{///研究项目信息
            addResearch:"research/addResearch",//新增研究项目和研究项目关联的产品
            deleteResearch:"research/deleteResearch",//删除研究项目
            getResearchs:"research/getResearchs",//获取当前公司下的所有研究项目
            saveResearch:"research/saveResearch",//更新研究项目
        },
        reportController:{//报告处理
            addReport:"report/addReport",//添加报告
            deleteReport:"report/deleteReport",//删除报告
            getReport:"report/getReport",//获取报告
            searchReport:"report/searchReport",//检索报告
            copyReport:"report/copyReport",//复制报告
            createVerion:"report/createVerion",/////创建新版本
        },
        pagesConfigController:{///后台个例报告Tab页配置
            deletePagesById:"pageConfig/deletePagesById",//根据Id，删除Tab页
            getCurrCompanyPages:"pageConfig/getCurrCompanyPages",//获取当前公司的Tab页信息
            updatePagesByDto:"pageConfig/updatePagesByDto",//根据Dto修改当前Tab页
        },
        menuConfigController:{/// 菜单配置（包括二级菜单）
            addMenuByDto:"menuConfig/addMenuByDto",//新增一级菜单
            addMenuDtlByDto:"menuConfig/addMenuDtlByDto",//新增二级菜单
            deleteMenuById:"menuConfig/deleteMenuById",//删除一级菜单
            deleteMenuDtlById:"menuConfig/deleteMenuDtlById",//删除二级菜单
            getCurrCompanyMenu:"menuConfig/getCurrCompanyMenu",//查询当前所有一级菜单
            getCurrCompanyMenuDtlByMenu:"menuConfig/getCurrCompanyMenuDtlByMenu",//根据一级菜单ID，查询二级菜单
            updateMenuByDto:"menuConfig/updateMenuByDto",//修改一级菜单
            updateMenuDtlByDto:"menuConfig/updateMenuDtlByDto",//修改二级菜单
        },
        fieldConfigController:{///后台字段配置
            addFieldByDto:"fieldConfig/addFieldByDto",//新增字段
            deleteFieldById:"fieldConfig/deleteFieldById",//根据ID删除字段
            getAllFieldsByCompany:"fieldConfig/getAllFieldsByCompany",//查询公司拥有的所有字段
            getCurrentCompanyFields:"fieldConfig/getCurrentCompanyFields",//查询当前登录用户所属公司所拥有的字段
            getCurrentCompanyFieldsByMap:"fieldConfig/getCurrentCompanyFieldsByMap",//根据Map查询当前公司下所有未删除字段
            updateFieldByDto:"fieldConfig/updateFieldByDto",//修改字段
        },
        ageGroupController:{///年龄层配置规则
            ageGroupList:"agegroupconfig/ageGroupList",//查询本公司所有年龄配置
            ageGroupSelectItem:"agegroupconfig/ageGroupSelectItem",//获取年龄层字典
            ageUnit:"agegroupconfig/ageUnit",//获取年龄单位字典
            deleteAgeGroup:"agegroupconfig/deleteAgeGroup",//删除年龄配置
            saveAgeGroup:"agegroupconfig/saveAgeGroup",//保存年龄配置
        },
        baseLineListingConfigController:{//基础行配置
            deleteBaseLineListingByID:"BaseLineListingConfig/deleteBaseLineListingByID",//根据ID，删除基础行数据
            getBaseLineListingByPageId:"BaseLineListingConfig/getBaseLineListingByPageId",//根据PagesId，获取当前公司的基础行数据
            getBaseLineListingCount:"BaseLineListingConfig/getBaseLineListingCount",//获取当前公司的基础行条数
            getBaseLineListingWithoutPageInfo:"BaseLineListingConfig/getBaseLineListingWithoutPageInfo",//获取当前公司，所有基础行数据（不分页）
            getCurrCompanyBaseLineListing:"BaseLineListingConfig/getCurrCompanyBaseLineListing",//获取当前公司的基础行数据
            initBaseLineListing:"BaseLineListingConfig/initBaseLineListing",//初始化当前公司的基础行数据
            updateBaseLineListingByDto:"BaseLineListingConfig/updateBaseLineListingByDto",//根据ID，更新基础行数据
        },
        configEventController:{////事件描述配置
            DeleteConfigEventField:"configevent/DeleteConfigEventField",//删除事件描述详情配置
            deleteConfigEvent:"configevent/deleteConfigEvent",//删除事件描述
            deleteConfigEventRecord:"configevent/deleteConfigEventRecord",//删除事件描述详情
            getConfigEventFieldList:"configevent/getConfigEventFieldList",//编辑本公司事件描述详情所需数据
            getConfigEventList:"configevent/getConfigEventList",//查询本公司所有事件描述配置
            getConfigEventRecordList:"configevent/getConfigEventRecordList",//查询本公司所有事件描述配置详情
            getFieldFromPage:"configevent/getFieldFromPage",//获取页面selectlist
            getPagesList:"configevent/getPagesList",//获取页面selectlist
            saveConfigEvent:"configevent/saveConfigEvent",//保存事件描述
            saveConfigEventField:"configevent/saveConfigEventField",//保存事件描述详情配置
            saveConfigEventRecord:"configevent/saveConfigEventRecord",//保存事件描述详情
        },
        evaluationCriterionConfigController:{/// 因果评分配置
            addEvaluationCriterionByDto:"evaluationCriterionConfig/addEvaluationCriterionByDto",//新增因果评分
            deleteEvaluationCriterionById:"evaluationCriterionConfig/deleteEvaluationCriterionById",//删除因果评分
            getAllEvaluationCriterion:"evaluationCriterionConfig/getAllEvaluationCriterion",//获取因果评分
            updateEvaluationCriterionByDto:"evaluationCriterionConfig/updateEvaluationCriterionByDto",//修改因果评分
        },
        indexController:{// 反馈数据处理
            addFeedbackTask:"feedback/addFeedbackTask",///新建导入任务
            getFeedbackTask:"feedback/getFeedbackTask",///新建导入任务
        },
        informationController:{///企业信息
            addAdrReportUnit:"information/addAdrReportUnit",///新增ADR报告单位信息
            deleteAdrReportUnit:"information/deleteAdrReportUnit",///删除上报单位信息
            getCompanyInformation:"information/getCompanyInformation",///读取企业信息
            saveAdrReportUnit:"information/saveAdrReportUnit",///更新ADR报告单位信息
            saveCompanyInfomation:"information/saveCompanyInfomation",///保存企业信息
        },
        itemConfigController:{///后台数据字典配置
            addItemByDto:"itemConfig/addItemByDto",//新增选项
            addItemClassByDto:"itemConfig/addItemClassByDto",//新增数据字典
            deleteItemById:"itemConfig/deleteItemById",//根据Id删除选项
            getAllItemClass:"itemConfig/getAllItemClass",//根据当前登录用户所在公司，获取未删除的数据字典
            getItemsByItemClassId:"itemConfig/getItemsByItemClassId",//根据ItemClassId和当前登录用户所在的公司，获取数据字典的选项
            updateItemById:"itemConfig/updateItemById",//根据ID筛选Items，并根据Dto更新
        },
        lineListingConfigController:{///行列表配置
            addLineListingMstByDto:"LineListingConfig/addLineListingMstByDto",///根据DTO，新增行列表配置
            deleteLineListingById:"LineListingConfig/deleteLineListingById",///根据ID，删除行列表配置
            getCurrCompanyLineListingMst:"LineListingConfig/getCurrCompanyLineListingMst",///获取当前公司，所有行列表配置数据
            getLineListingDtlWithoutPageInfo:"LineListingConfig/getLineListingDtlWithoutPageInfo",///获取当前公司，所有行列表-基础行关联数据
            updateLineListingDtlByList:"LineListingConfig/updateLineListingDtlByList",///根据List，更新行列表-基础行关联数据
            updateLineListingMstByDto:"LineListingConfig/updateLineListingMstByDto",///根据DTO，更新行列表配置
        },
        logoConfigController:{/// Logo配置与读取
            getLogoUrl:"LogoConfig/getLogoUrl",//获取LogoUrl
            uploadLogo:"LogoConfig/uploadLogo",//上传Logo
        },
        mailConfigController:{/// 邮件配置规则
            DeleteMailConfig:"mailconfig/DeleteMailConfig",///删除邮件配置
            DeleteTopicOrTextField:"mailconfig/DeleteTopicOrTextField",///删除邮件配置详情
            GetTaskFieldList:"mailconfig/GetTaskFieldList",///邮件配置可配置字段
            GetTopicOrTextFieldList:"mailconfig/GetTopicOrTextFieldList",///本公司邮件配置详情
            SaveMailConfigRecord:"mailconfig/SaveMailConfigRecord",///保存邮件配置
            SaveTopicOrTextField:"mailconfig/SaveTopicOrTextField",///保存邮件配置详情
            Sequencechange:"mailconfig/Sequencechange",///更改邮件详情配置排序
            getMailConfigList:"mailconfig/getMailConfigList",///查询本公司邮件配置
        }
    };
	return urls;
}));
