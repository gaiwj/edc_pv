/**
 * Created by sky.cai on 2017/4/19.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var redis = require("./redis");
/* POST login . */
router.post('/UserLogin', function(req, res, next) {
    config.request({
        req: req,
        callback: function (result) {
            //req.session.userInfo = userInfo;
            //config.userInfo = userInfo; maxAge:360*1000,
            //  if(result.IsSuccessful) {
            //      res.cookie('userInfo', JSON.stringify(result.Body), {
            //          path:'/', httpOnly:true
            //      });
            //  }
            var uc = {},
                bp1 = {};
            if(result.Body) {
                uc.SessionKey = result.Body["SessionKey"];
                uc.UserId = result.Body["UserId"];
                uc.UserName = result.Body["UserName"];
                uc.Name = result.Body["Name"];
                bp1.CurrentCompanyId = result.Body["CompanyId"];
                bp1.SignatureType = result.Body["SignatureType"];
            }
            //test
            redis.set("usercache_test",JSON.stringify(uc));
            req.session.usercache_test = uc;
            //=========
            res.cookie('usercache',JSON.stringify(uc) , {
                 path:'/', maxAge:3600*1000
             });
            res.cookie('browseparam1',JSON.stringify(bp1) , {
                path:'/', maxAge:3600*1000
            });
            res.json(result);
        },
        errCallback: function (error) {
            req.res.status(501).send({status: error.status, errMsg: error.errMsg});
        }
    });
});

module.exports = router;

