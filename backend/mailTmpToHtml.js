var fs = require('fs');
var markdown = require( 'markdown' ).markdown;

var _accountInfo = {
    name:'paul',
    account: '100.00'
};

var data = {
    detailLink:'http://ez.com'
};

var mailbody = 'Hi ' + _accountInfo.name + ',' + '\n '
             + '\n '
             + 'The following is **Weekly Report** of your lunch account' + '\n '
             + '\n '
             + 'Name ||Acount ' + '\n '
             + '-----------||-------------' + '\n '
             + _accountInfo.name + '||' + _accountInfo.account + '\n '
             + '\n '
             + 'You can get more detail from [here] ' + '('+ data.detailLink + ')'+ '\n '
             + 'Regards,'  + '\n\r'
             + 'Lunch Team' + '\n';
                          
var markdown = require('markdown').markdown;
data.html = markdown.toHTML(mailbody, 'Maruku');
//data.html = markdown.toHTML(mailbody, 'Maruku');
fs.writeFileSync('tempTest.html', data.html);