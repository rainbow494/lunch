var fs = require('fs');
var mailTmpToHtml =  require('./mailTmpToHtml.js').mailTmpToHtml();

var _accountInfo = {
    name : 'paul',
    account : '101.00'
};

var config = {
    detailLink : 'http://lunchteam/index.html'
};

var data = {
    'name' : capitalizeFirstLetter(_accountInfo.name),
    'account' : _accountInfo.account,
    'detailLink' : config.detailLink
};

// console.log(JSON.stringify(data)); // code for debug
var mailBody = mailTmpToHtml.CreateMailBody(data);
fs.writeFileSync('test/mailTempTest.html', mailBody);
console.log('build test result success!');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
