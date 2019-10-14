var express = require('express');
var accountDao = require('../models/dao/accountDao');
var router = express.Router();

// get: 查詢所有會員資料
router.get('/', async(req, res) => {
    try {
        let memberInfo = await accountDao.queryMemberInfo();
        res.json(memberInfo);
    }
    catch (err) {

    }
})

// get: 查詢單筆會員資料
router.get('/:account', async(req, res) => {
    try {
        let account = req.params.account;
        let memberInfo = await accountDao.queryMemberInfo(account);
        res.json(memberInfo);
    }
    catch (err) {

    }
})

// post: 加入(新增)會員
router.post('/', async(req, res) => {
    try {
        let memberData = {
            account: req.body.account,
            username: req.body.username,
            password: req.body.password,
            timeInsert: req.body.timeInsert,
            timeUpdate: req.body.timeUpdate
        }
        if (req.body.phone != null) {
            memberData.phone = req.body.phone;
        }
        let result = await accountDao.addMemberData(memberData);
        res.json(result);
    }
    catch (err) {

    }
})

// delete: 刪除帳號
router.delete('/:account', async(req, res) => {
    try {
        let account = req.params.account;
        let result = await accountDao.deleteMember(account);
        res.json(result);
    }
    catch (err) {

    }
})

// put: 修改會員資料
router.put('/:account', async(req, res) => {
    try {
        let account = req.params.account;
        var memberData = new Object();

        if (req.body.username != null) {
            memberData.username = req.body.username;
        }
        if (req.body.password != null) {
            memberData.password = req.body.password;
        }
        if (req.body.phone != null) {
            memberData.phone = req.body.phone;
        }
        memberData.timeUpdate = req.body.timeUpdate;
        
        let result = await accountDao.modifyMemberData(account, memberData);
        res.json(result);
    }
    catch (err) {

    }
})
    

module.exports = router;
  