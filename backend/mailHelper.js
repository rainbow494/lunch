//Todo 1: init mailgun when mail helper init and use mailgun
//Todo 2: call send mail function by promise way
//Todo 3: display send mail response correct.
(function() {
    var Promise = require("bluebird"),
        mailgunGen = require('mailgun-js'),
        dbHelper = require('./mongodbExecutor.js').mongdbExecutor();

    var defaultMailApiConfig = {
        apiKey: 'key-ea2e3ab5ee11c200168588fc18acf3a3',
        domain: '1234qwerasdf.com'
    };

    //function MailHelper(option) {
    function MailHelper() {
        // var _mailApiConfig = option || defaultMailApiConfig;

        // this.mailgun = mailgunGen({
        // apiKey : _mailApiConfig.apiKey,
        // domain : _mailApiConfig.domain
        // });
    }

    var defaultSender = {
        from: 'rainbow494@qq.com',
        to: 'rainbow494@gmail.com',
        subject: 'lunch team',
        text: '',
        detailLink: 'http://52.68.53.107:3000/index.html'
    };

    function _getMailBody(accountInfo) {
        var _accountInfo = accountInfo[0];

        var data = defaultSender;

        if (_accountInfo.mail)
            data.to = _accountInfo.mail;

        var replyMessage = [];
        replyMessage.push('Hi ' + _accountInfo.name + ',');
        replyMessage.push(" ");
        replyMessage.push("At the end of this week, your account is " + _accountInfo.account + ".");
        replyMessage.push("More detail can get from here ---- " + data.detailLink);
        replyMessage.push(" ");
        replyMessage.push("Regards, Lunch Team");
        data.text = replyMessage.join('\n\r');

        return Promise.resolve(data);
    }

    MailHelper.prototype._getMailBody = _getMailBody;

    function _sendmail(mailbody, mailgun) {
        //Todo: Call send method by promise pattern
        //Promise.promisifyAll(mailgun.messages().send);

        mailgun = mailgunGen({
            apiKey: defaultMailApiConfig.apiKey,
            domain: defaultMailApiConfig.domain
        });


        //Todo 3: display send mail response correct.
        mailgun.messages().send(mailbody, function(error, result) {
            if (error) {
                console.log('Error : ' + error);
            }
            if (result) {
                console.log('Resp : ' + result[0]);
            }
        });
    }

    function sendReport(accountName) {
        //var mailgun = this.mailgun;
        return dbHelper.queryAccountByName(accountName)
            .then(_getMailBody)
            .then(_sendmail);
        // .then(function (mailbody) {
        // //return _sendmail(mailbody, mailgun);
        // return _sendmail(mailbody);
        // });
    }
    MailHelper.prototype.sendReport = sendReport;

    MailHelper.prototype.sendWeeklyReports = function() {
        return dbHelper.querySummary()
            .then(function(result) {
                result.forEach(function(account) {
                    sendReport(account.name);
                });
            });
    };

    module.exports.mailHelper = function(option) {
        return new MailHelper(option);
    };
})();