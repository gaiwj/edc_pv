const request = require('request');
const rp = require('request-promise');
const Promise = require('bluebird');
const urls = require("./public/assets/js/modules/urls");
const request_host = urls.api_host;
//const request_host = "http://localhost:91/";        //启用模拟服务器数据

//get http headers
function getApiHeader(uc) {
    return {
        SessionKey: uc.SessionKey || "",
        EquipmentCode: "11",
        ActionName: "",
        Language: "chs",
        SignValue: "",
        Ip: "",
    };
}

//提供promise 直渲数据
function getRequestPromise(options) {
    //var uc = usercache.get(options.req, true);
     var uc = {};
     var usercache = options.req.cookies.usercache;
     if(usercache) {
        uc = JSON.parse(usercache);
     }
    var _header = getApiHeader(uc);
    var urls = options.urls;
    var rps = [];
    for(var i=0; i< urls.length;i++) {
        var _param = urls[i].body || {};
        var method=urls[i].method||options.req.method;
        var opts = {
            method:method,
            baseUrl:config.host,
            uri: urls[i].originalUrl,
            body:_param,
            //gzip: true,
            json:true
        }
        rps.push(rp(opts));
    }
    Promise.all(rps).then(function(data){
        //var body = transferByKey(data);
        options.callback(data);
    });
}

//根据结果集的key，返回对应数据
function transferByKey(data) {
    var body = [];
    if(Object.prototype.toString.call(data) == "[object Object]"){
        if(data && data["Body"]){
            body = data["Body"]
        }else {
            body = data;
        }
    }else{
        for(var i=0;i<data.length;i++) {
            var _data = data[i];
            if(_data && _data["Body"]){
                body.push(_data["Body"]);
            }else {
                body.push(_data);
            }
        }
    }

    return body;
}

//提供node直渲数据
function getSyncRequest(options) {
    var _param = options.body || {};
    var uc = {};
    var usercache = options.req.cookies.usercache;
    if(usercache) {
        uc = JSON.parse(usercache);
    }
    var _header = getApiHeader(uc);
    var opts = {
        method: options.req.method,
        baseUrl: config.host,
        uri: options.originalUrl,
        body: _param,
        //gzip: true,
        //agent: false,
        json: true
    };
    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //var body = transferByKey(body);
            options.callback(body);
        }
        else {
            console.log(error);
        }
    });
}

//提供异数回调数据
function getRequest(options) {
    var req = options.req;
    var _param = req.body || {};//post
    var uc = {};
    var usercache = req.cookies.usercache;
    if(usercache) {
        uc = JSON.parse(usercache);
    }
    var _header = getApiHeader(uc);

    console.log(" - SessionKey：【" + uc.SessionKey + "】\n");
    console.log(" - 发送请求：【" + req.method + "：" + req.originalUrl + "】\n");
    console.log(" - 请求参数：" + JSON.stringify(_param) + "\n");

    var opts = {
        method: req.method,
        baseUrl: config.host,
        uri: req.originalUrl,
        body: _param,
        //gzip: true,
        //agent: false,
        headers: {
            'contentType':"application/json",
        },
        json: true
    };

    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(" - 请求【" + req.method + "：" + req.originalUrl +"】返回数据：\n" + JSON.stringify(body) + "\n");
            if (options.callback) options.callback(body);
        }
        else {
            var errorobj = {
                errMsg: error
            };
            console.log(" - 请求【" + req.method + "：" + req.originalUrl +"】出错：\n" + JSON.stringify(errorobj) + "\n");
            if (options.errCallback) options.errCallback(errorobj);
        }
    });
}

// 根据当前请求转发请求
function getCallback(req, res, next) {
    getRequest({
        req: req,
        callback: function (result) {
            res.json(result);
        },
        errCallback: function (error) {
            res.status(501).send({status: error.status, errMsg: error.errMsg});
        }
    });
}

const config = {
    host: request_host,
    request: getRequest,
    syncRequest: getSyncRequest,
    requestPromise: getRequestPromise,
    callback: getCallback,
    //loadSysType: loadSysType,
    message: "配置全局方法..."
};

module.exports = config;