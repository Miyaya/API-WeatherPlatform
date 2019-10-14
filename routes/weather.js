// const jwt = require('jsonwebtoken');
var verifyModel = require('../models/verifyModel');
var weatherDao = require('../models/dao/weatherDao');
var accountDao = require('../models/dao/accountDao');
var express = require('express');
// var request = require('request');
var rp = require('request-promise');
var router = express.Router();

var env = process.env.ENV || 'dev';
const config = require('../config/' + env + '/config.json');


router.post('/:mode', async(req, res) => {
    try {
        // 檢查token是否存在
        const token = req.headers['token'];
        if (token == null || token == '') {
            res.json({
                status: "failed",
                msg: "token不存在"
            })
        }
        else {
            var result = [];
            // 驗證token
            tokenResult = verifyModel.verifyToken(token)
            .then(tokenResult => {
                // console.log('result=', tokenResult);
                if (tokenResult === false) {
                    res.json({
                        status: "failed", 
                        msg: "連線狀態逾時或已登出"
                    })
                }
                else {
                    let memberInfo = accountDao.queryMemberInfo(req.body.account);
                    if (memberInfo.FLD_loginStatus == 0) {
                        res.json({
                            status: "failed",
                            msg: "連線狀態逾時或已登出"
                        })
                    }
                    else{
                        if (tokenResult != req.body.account) {
                            res.json({
                                status: "failed",
                                msg: "已使用別的帳號登入"
                            })
                        }
                        // 成功
                    }
                }
            })
            switch (req.params.mode) {
                // 會員天氣模組 with DB
                case 'checkLocationName':
                    // console.log('mode: checkLocationName');
                    result = await weatherDao.checkLocationName(req.body.account);
                    result.status = "success";
                    res.json(result);
                    break;

                case 'addLocation':
                    // console.log('mode: addLocation');
                    var locationList = [];
                    locationList = req.body.locationName;
                    result = await weatherDao.addLocation(req.body.account, locationList);
                    if (result.affectedRows > 0){
                        res.json({
                            status: 'success'
                        });
                    }
                    else if (result.msg=='no modify') {
                        res.json(result);
                    }
                    else {
                        res.json({
                            status: 'failed'
                        });
                    }
                    break;
                    
                // 查詢天氣資料 by 中央氣象局 API
                case 'query_36h':
                    // console.log('mode: query_36h');
                    var options = {
                        uri: config.baseURL + config.URL36h,
                        headers: {
                            authorization: config.authorization
                        },
                        method: 'GET',
                        json: true
                    };
                    options = await getOpendata(req.body, options);
                    options.uri = encodeURI(options.uri);
                    rp(options).then((result) => {
                        res.json(result);
                    })
                    .catch((err) => {
                        console.log('err:', err);
                    });
                    break;

                case 'query_1w':
                    // console.log('mode: query_1w');
                    var options = {
                        uri: config.baseURL + config.URL1w,
                        headers: {
                            authorization: config.authorization
                        },
                        method: 'GET',
                        json: true
                    };
                    options = await getOpendata(req.body, options);
                    options.uri = encodeURI(options.uri);

                    rp(options).then((result) => {
                        res.json(result);
                    })
                    .catch((err) => {
                        console.log('err:', err);
                    });
                    break;
            }
        }
    }
    catch (err) {

    }
});

var getOpendata = async(req, options) => {
    var i=0;
    while (req.locationName!=null) {
        if (i==0)
            options.uri += '?locationName=';
        options.uri += req.locationName[i];
        if (++i < req.locationName.length) {
            options.uri += ',';
        }
        else
            break;
    }
    return options;
}

module.exports = router;