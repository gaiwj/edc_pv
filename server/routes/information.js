/**
 * Created by xiaoshuo.liu on 2017/5/3.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls=require('../public/assets/js/modules/urls');

router.get('/preProductInfo',function(req,res,next){
    var html=template('/information/preProductInfo',{title:'药物安全管理系统'})
    res.send(html)
})
/*产品信息上市后*/
router.get('/saleProductInfo',function(req,res,next){
    var html=template('/information/saleProductInfo',{title:'药物安全管理系统'})
    res.send(html)
})
/*研究项目*/
router.get('/research',function(req,res,next){
    var html=template('/information/research',{title:'药物安全管理系统'})
    res.send(html)
})
/*企业信息*/
router.get('/enterpriseInfor',function(req,res,next){
    var html=template('/information/research',{title:'药物安全管理系统'})
    res.send(html)
})


module.exports = router;