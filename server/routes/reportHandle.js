/**
 * Created by xiaoshuo.liu on 2017/5/3.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var urls=require('../public/assets/js/modules/urls');
/**个例报告***/
router.get('/reportCase',function(req,res,next){
    var html=template('/reportHandle/reportCase',{title:'药物安全管理系统-Drug Safety Management System'})
    res.send(html)
})



module.exports = router;