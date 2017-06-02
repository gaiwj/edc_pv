/**
 * Created by sky.cai on 2017/3/14.
 */
var db = {};
var redis = require('redis'),
    RDS_PORT = 6379,
    RDS_HOST = '192.168.1.216',
    RDS_PWD = 'redis123',
    RDS_OPTS = {db:"10"};
var client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

client.on("error", function (err) {
    console.log("Error :" , err);
});

client.auth(RDS_PWD,function(){
    console.log('通过认证');
});

client.on('connect', function(){
    console.log('Redis连接成功.');
});

client.on('ready',function(err){
    console.log('ready');
});

/**
 * 添加string类型的数据
 * @param key 键
 * @params value 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */
db.set = function(key, value, expire, callback){
    client.set(key, value, function(err, result){
        if (err) {
            console.log(err);
            if(callback) {
                callback(err,null);
            }
            return;
        }
        if (!isNaN(expire) && expire > 0) {
            client.expire(key, parseInt(expire));
        }
        client.quit();
        if(callback) {
            callback(null,result);
        }

    })
    /*client.select('7', function(error){
        if(error) {
            console.log(error);
        } else {
            // set
        }
    });*/
}

/**
 * 查询string类型的数据
 * @param key 键
 * @param callBack(err,result)
 */
db.get = function(key, callback){
    client.get(key, function(err,result){
        if (err) {
            console.log(err);
            if(callback) {
                callback(err,null);
            }
            return;
        }
        client.quit();
        if(callback) {
            callback(null,result);
        }
    });
}

/**
 * 添加object类型的数据
 * @param key 键
 * @params object 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */
db.setObject = function (key, object, expire, callback) {
    client.hmset(key, object, function (err, result) {
        if(err) {
            console.log(err);
            if(callback) {
                callback(err,null);
            }
            return;
        }
        if (!isNaN(expire) && expire > 0) {
            client.expire(key, parseInt(expire));
        }
        client.quit();
        if(callback) {
            callback(null,result);
        }
    });
}

/**
 * 查询object类型的数据
 * @param key 键
 * @param callBack(err,result)
 */
db.getObject = function(key, callback){
    client.hgetall(key, function (err, result) {
        if (err) {
            console.log(err);
            if(callback) {
                callback(err,null);
            }
            return;
        }
        client.quit();
        if(callback) {
            callback(null,result);
        }
    });
}

module.exports = db;
