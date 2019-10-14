var mysql = require('mysql');
var env = process.env.ENV || 'dev';
// var logger = require('../logger');
var util = require('util');

const config = require('../config/' + env + '/config.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

pool.getConnection((err, connection) => {
    if (err) {
        throw err;
    }
    if (connection) connection.release();
    console.log('connecting success\n');
});

pool.query = util.promisify(pool.query);

var ExcuteQuery = (strSQL, param, funcName) => {
    return pool.query(strSQL, param)
        .then(result => {
            // console.log(result);
            return JSON.parse(JSON.stringify(result));
        }).catch((err) => {
            // if (param == null)
            //     param = new Array();
            // logger.error(
            //     '<' + funcName + '>\r\n' +
            //     'SQL Command:\r\n' + strSQL + '\r\n' +
            //     'SQL Paramter:' + param.join(',') + '\r\n' +
            //     'Exception:' + err
            // );
            console.log(err);
            return null;
        });
}

module.exports = {
    ExcuteQuery: ExcuteQuery
}