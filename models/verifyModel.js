const jwt = require('jsonwebtoken');

var env = process.env.ENV || 'dev';
const config = require('../config/' + env + '/config.json');

var verifyToken = async(token) => {
    let tokenResult = '';
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => { // code from: https://ithelp.ithome.com.tw/articles/10195676
        //判斷token是否正確
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    tokenResult = false;
                    resolve(tokenResult);
                    //token過期判斷
                } else if (decoded.exp <= time) {
                    tokenResult = false;
                    resolve(tokenResult);
                    //若正確
                } else {
                    tokenResult = decoded.data
                    resolve(tokenResult);
                }
            })
        }
    });
}
module.exports = {
    verifyToken: verifyToken
}