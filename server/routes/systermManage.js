/**
 * Created by xiaoshuo.liu on 2017/5/3.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls=require('../public/assets/js/modules/urls');
/**系统配置***/
router.get('/systermConfig',function(req,res,next){
    var html=template('/systermManage/systermConfig',{title:'药物安全管理系统-Drug Safety Management System'})
    res.send(html)
})
/**字段配置***/
router.get('/reportSetting',function(req,res,next){
    var html=template('/systermManage/reportSetting',{title:'药物安全管理系统-Drug Safety Management System'})
    res.send(html)
})
/**规则配置***/
router.get('/ruleConfig',function(req,res,next){
    config.requestPromise({
        req:req,
        urls:[
            {
                method:"GET",
                originalUrl:urls.ageGroupController.ageGroupSelectItem,
            },
            {
                method:"GET",
                originalUrl:urls.ageGroupController.ageUnit,
            },

            ],
        callback:function (json) {
            var _agedescitem=json[0];
            var _agunititem=json[1];
            var html=template('/systermManage/ruleConfig',{
                title:'药物安全管理系统-Drug Safety Management System',
                agedescitem:_agedescitem.data,
                agunititem:_agunititem.data
            })
            res.send(html)
        }
    })
})



module.exports = router;