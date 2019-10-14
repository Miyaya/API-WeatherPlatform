var dbAccess = require('../dbAccess');
const jsName = 'dbAccess/';
const dbName = 'members_new';

var env = process.env.ENV || 'dev';
const config = require('../../config/' + env + '/config.json');

var checkLocationName = async (account) => {
    var funcName = jsName + module.exports.checkLocationName.name;
    var strSQL = 'SELECT FLD_json -> \'$.locationName\' as "locationName" from ' + dbName + ' WHERE FLD_account = ?';
    var result = await dbAccess.ExcuteQuery(strSQL.toString(), account, funcName);
    return result;
}

var addLocation = async (account, locationName) => {
    var funcName = jsName + module.exports.checkLocationName.name;
    var strSQL = 'UPDATE ' + dbName + ' set FLD_json = JSON_ARRAY_APPEND(FLD_json'; 
    var existLocation = await checkLocationName(account);
    var li = []; 

    // locationName array(value的部分)不知為何存成string，這邊把他重parse
    var tmp = '{"locationName":' + existLocation[0].locationName + '}';
    var existLocation = JSON.parse(tmp);

    // 每個輸入都檢查是否已存在
    var modified = 0;
    for (i=0; i<locationName.length; i++) {
        if (existLocation.locationName.find((element) => {
            return element == locationName[i]}) != undefined) {
            console.log("duplicated location name: ", locationName[i]);
        }
        else {
            li.push(locationName[i]);
            strSQL += ', "$.locationName", ?';
            modified = 1;
        }
    }
    if (modified==0) {
        return {status: "success", msg: "no modify"}
    }
    strSQL += ' ) WHERE FLD_account = ?';
    li.push(account);
    var result = await dbAccess.ExcuteQuery(strSQL.toString(), li, funcName);
    return result;
}

module.exports = {
    checkLocationName: checkLocationName,
    addLocation: addLocation
}