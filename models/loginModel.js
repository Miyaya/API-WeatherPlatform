var express = require('express');
var accountDao = require('../models/dao/accountDao');
var router = express.Router();
var jwt = require('jsonwebtoken')

var env = process.env.ENV || 'dev';
const config = require('../config/' + env + '/config.json');

var loginAction = async (memberData) => {
    let memberQuery = await accountDao.queryMemberInfo(memberData.account);
    if (memberQuery == null || memberData.password != memberQuery[0].FLD_password) {
        return {state: "登入失敗: 帳號不存在或密碼錯誤", result: null};
    }
    const token = jwt.sign({
        algorithm: 'HS256',
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: memberQuery[0].FLD_account
    }, config.secret);
    let status = await accountDao.changeStatus('in', memberData.account);
    if (status == null) {
        return {state: "登入失敗: 無法存取登入狀態", result: null};
    }
    return {state: "登入成功", result: 'success', token: token};
}

var logoutAction = async (account) => {
    let status = await accountDao.changeStatus('out', account);
    if (status == null) {
        return {state: "登出失敗", result: null};
    }
    return {state: "登出成功", result: 'success'};
}

module.exports = {
    loginAction: loginAction,
    logoutAction: logoutAction
}