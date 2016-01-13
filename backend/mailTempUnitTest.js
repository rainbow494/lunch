var fs = require('fs');
var mailHelper = require('./mailHelper').mailHelper();
var mailTmpToHtml = require('./mailTmpToHtml').mailTmpToHtml();

var _accountInfo = {
    name : 'paul',
    account : '101.00'
};

var config = {
    detailLink : 'http://lunchteam/index.html'
};

var details = [{
        'displayDate' : '2015-01-13',
        'weekDay' : '周一',
        'amount' : -1
    }, {
        'displayDate' : '2015-01-14',
        'weekDay' : '周二',
        'amount' : 100
    }
];

var data = {
    'date' : '2015-01-13',
    'name' : capitalizeFirstLetter(_accountInfo.name),
    'account' : _accountInfo.account,
    'details' : details,
	'expense':mailHelper._getExpense(details),
    'detailLink' : config.detailLink
};

// console.log(JSON.stringify(data)); // code for debug
var mailBody = mailTmpToHtml.CreateMailBody(data);
fs.writeFileSync('test/mailTempTest.html', mailBody);
console.log('build test result success!');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
