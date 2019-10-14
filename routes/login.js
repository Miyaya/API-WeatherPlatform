var express = require('express');
var loginModel = require('../models/loginModel');
var router = express.Router();

// 登入: post 帳號跟密碼
router.post('/:account', async(req, res) => {
    try {
        let memberData = {
            account: req.params.account,
            password: req.body.password,
        }
        let result = await loginModel.loginAction(memberData);
        res.setHeader('token', result.token);
        delete result.token;
        
        res.json(result);
    }
    catch (err) {

    }
});

// 登出: delete 帳號
router.delete('/:account', async(req, res) => {
    try {
        let account = req.params.account;
        let result = await loginModel.logoutAction(account);
        res.json(result);
    }
    catch (err) {

    }
});

module.exports = router;