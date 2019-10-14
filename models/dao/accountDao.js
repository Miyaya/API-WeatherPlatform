var dbAccess = require('../dbAccess');
const jsName = 'dbAccess/';
const dbName = 'members_new';
//var stringbuilder = require('node-stringbuilder');

var queryMemberInfo = async (account) => {
    //var strSQL = new stringbuilder();
    var strSQL = 'SELECT * FROM ' + dbName;

    // 密碼不公開
    //var strSQL = 'SELECT FLD_account, FLD_username, FLD_phone, FLD_timeInsert, FLD_timeUpdate FROM ' + dbName;
    var funcName = jsName + module.exports.queryMemberInfo.name;

    // 單筆會員資料查訊
    if (account != null) {
        strSQL += ' WHERE FLD_account = ?';
        return await dbAccess.ExcuteQuery(strSQL.toString(), account, funcName);
    }

    return await dbAccess.ExcuteQuery(strSQL.toString(), null, funcName);
}

var addMemberData = async (memberData) => {
    var funcName = jsName + module.exports.addMemberData.name;

    var strSQL = 'INSERT INTO ' + dbName + ' (FLD_account, FLD_username, FLD_password, FLD_timeInsert, FLD_timeUpdate';
    var param = [memberData.account, memberData.username, memberData.password, memberData.timeInsert, memberData.timeUpdate];
    
    // phone非必填
    if (memberData.hasOwnProperty('phone')) {
        strSQL += ', FLD_phone) VALUES (?, ';
        param.push(memberData.phone);
    }
    else {
        strSQL += ') VALUES (';
    }
    strSQL += '?, ?, ?, ?, ?)';
    var result = await dbAccess.ExcuteQuery(strSQL.toString(), param, funcName);
    if (result == null) {
        return {result: 'failed'};
        // 應該要throw err嗎
    }
    return {result: 'success'};
}

var deleteMember = async (account) => {
    //var strSQL = new stringbuilder();
    var strSQL = 'DELETE FROM ' + dbName + ' WHERE FLD_account = ?';
    var funcName = jsName + module.exports.queryMemberInfo.name;

    var result = await dbAccess.ExcuteQuery(strSQL.toString(), account, funcName);
    if (result == null) {
        return {result: 'failed'};
        // 應該要throw err嗎
    }
    return {result: 'success'};
}

var modifyMemberData = async (account, memberData) => {
    //var strSQL = new stringbuilder();
    var strSQL = 'UPDATE ' + dbName + ' SET ';
    var funcName = jsName + module.exports.modifyMemberData.name;

    var list = [];
    var flag = false; // 判斷逗號

    if (memberData.hasOwnProperty('username')) {
        flag = true;
        strSQL += 'FLD_username = ? ';
        list.push(memberData.username);
    }

    if (memberData.hasOwnProperty('password')) {
        if (flag) str += ', ';
        flag = true;
        strSQL += 'FLD_password = ? ';
        list.push(memberData.password);
    }

    if (memberData.hasOwnProperty('phone')) {
        if (flag) str += ', ';
        flag = true;
        strSQL += 'FLD_phone = ? ';
        list.push(memberData.phone);
    }

    if (flag) strSQL += ', ';
    strSQL += 'FLD_timeUpdate = ? WHERE FLD_account = ?';
    list.push(memberData.timeUpdate);
    list.push(account);

    var result = await dbAccess.ExcuteQuery(strSQL.toString(), list, funcName);
    if (result == null) {
        return {result: 'failed'};
        // 應該要throw err嗎
    }
    return {result: 'success'};
}


var changeStatus = async (action, account) => {
    var funcName = jsName + module.exports.changeStatus.name;
    if (action == 'in') {
        status = 'true';
    }
    else if (action == 'out') {
        status = 'false';
    }

    var strSQL = 'UPDATE ' + dbName + ' SET FLD_loginStatus = ' + status + ' WHERE FLD_account = ?';
    var result = await dbAccess.ExcuteQuery(strSQL.toString(), account, funcName);
    if (result == null) {
        return {result: null};
    }
    
    return {result: 'success'};
}


module.exports = {
    queryMemberInfo: queryMemberInfo,  // get
    addMemberData: addMemberData,       // post
    deleteMember: deleteMember,         // delete
    modifyMemberData: modifyMemberData,  // put

    changeStatus: changeStatus  // login, logout
};