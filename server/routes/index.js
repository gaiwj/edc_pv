var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');

var app = express();
var http = require('http');
var request = require('request');
var rp = require('request-promise');
var path = require('path');
var urls = require("../public/assets/js/modules/urls");
//Node服务端直接渲染模板

router.get('/', function(req, res, next) {
    var html = template('index', {title:"药物安全管理系统-Drug Safety Management System"});
    res.send(html);
});

router.get('/', function(req, res, next) {
    //方式1：获取后端数据，绑定模板
    /*config.syncRequest({
         req:req,
         originalUrl:urls.workhour.projectQuery,
         body:{},
         callback:function (data) {
             var html = template('index', {list:data,permission:[1,2,6,14,19,21]});
             res.send(html);
         }
     });*/
    //方式2：直接渲染页面（仅仅路由功能），在js/pages/*.js下异步获取数据，绑定模板
    // var html = template('index', {});
     //res.send(html);

    //方式3：获取多个api，promise实现
    /*config.requestPromise({
        req:req,
        urls:[{
            originalUrl:urls.workhour.projectQuery
        },{
            originalUrl:urls.workhour.planBriefQuery
        }],
        callback:function (data) {
            console.log(data[0]);
            console.log(data[1]);
            var html = template('index', {list:data[0]});
            res.send(html);
        }
    })*/
});

//Url传参，eg：http://127.0.0.1:89/index/detail?id=2&name=test
router.get('/:path', function (req, res, next) {
    var path = req.params.path;
    var id = req.query.id;
    var name = req.query.name;
    var html = template('index', {});
    res.send(html);
});

//模拟mock request-promise
var Promise = require('bluebird');
router.get('/demo',function (req, res, next) {
    var opts = {
        method:"get",
        uri:"http://127.0.0.1:8080/package.json",
        body:{id:"4592"},
        json:true
    };
    var opts2 = {
        method:"get",
        uri:"http://127.0.0.1:3001/test.json",
        body:{id:"4592"},
        json:true
    };
    var rp1 = rp(opts);
    var rp2 = rp(opts2);
    Promise.all([rp1,rp2]).then(function(data1,data2){
        console.log(data1);
        console.log(data2);
    })
})

//提供模拟接口给前端调用
router.get('/test', function(req, res, next) {
    //数据
    var data = {id:111,name:"testtest"};
    res.json(data);
});

module.exports = router;