//Todo 1: init mailgun when mail helper init and use mailgun
//Todo 2: call send mail function by promise way
//Todo 3: display send mail response correct.
(function() {
    var Promise = require('bluebird'),
        mailgunGen = require('mailgun-js'),
        //moment = require('moment'),
        util = require('./util'),
        dbHelper = require('./mongodbExecutor.js').mongdbExecutor(),
        mailTmpToHtml = require('./mailTmpToHtml.js').mailTmpToHtml();

    var defaultMailApiConfig = {
        apiKey: '<mailgun.api_key>',
        domain: '<mailgun.domain>'
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
        subject: '午饭小组',
        text: '',
        html: ''
    };

    var config = {
        detailLink: 'http://<aws.hostname>:<aws.webserver.port>/index.html'
    };

    function _getMailBody(account, details) {
        var data = defaultSender;

        if (account.mail)
            data.to = account.mail;

        var mailBodyData = {
            'date': util.getZhDate(),
            'name': account.name,
            'account': account.account,
            'details': _getDisplayDetails(details),
            'expense': _getExpense(details),
            'detailLink': config.detailLink,
        };

        var mailbody = mailTmpToHtml.CreateMailBody(mailBodyData);
        data.html = mailbody;

        return Promise.resolve(data);
        //return data;
    }

    function _getDisplayDetails(details) {
        var displayDetails = [];
        displayDetails = details.map(function(detail) {
            var displayDate = util.convertDBDateToDate(detail.date);
            var weekDay = util.getWeekdayOfDate(displayDate);
            return {
                'displayDate': displayDate,
                'weekDay': weekDay,
                'amount': detail.amount
            };
        });
        return displayDetails;
    }

    function _getExpense(details) {
        var expense = 0;
        if (details.length > 0)
            details.map(function(detail) {
                if (detail.amount < 0)
                    expense += detail.amount;
            });

        return expense;
    }

    function _sendmail(mailbody, mailgun) {
        //Todo: Call send method by promise pattern
        //Promise.promisifyAll(mailgun.messages().send);

        mailgun = mailgunGen({
            apiKey: defaultMailApiConfig.apiKey,
            domain: defaultMailApiConfig.domain
        });

        // Todo 3: display send mail response correct.
        mailgun.messages().send(mailbody, function (error, result) {
            if (error) {
                console.log('Error : ' + error);
            }
            if (result) {
                console.log('Resp : ' + result[0]);
            }
        });

        //console.log("---------------------------------------------");
        //console.log(mailbody.html);
        //console.log("---------------------------------------------");
        return Promise.resolve(true);
    }

    // Not support batch handle mail?
    function sendWeeklyReport(accountName) {
        var account = {};
        var startDate = util.getWeekStart();
        var endDate = util.getWeekEnd();

        return dbHelper.account.queryByName(accountName)
            .then(function(result) {
                account = result[0];
                //console.log("1: name:%s, mail:%s, length:%s", account.name, account.mail, result.length);
                return dbHelper.detail.queryByNameAndDate(account.name, startDate, endDate);
            })
            .then(function(details) {
                return _getMailBody(account, details);
            })
            .then(function(mailbody) {
                return _sendmail(mailbody);
            });
            
    }

    function _sendWeeklyReportBatch(account) {
        var startDate = util.getWeekStart();
        var endDate = util.getWeekEnd();

        return dbHelper.detail.queryByNameAndDate(account.name, startDate, endDate)
            .then(function(details) {
                return _getMailBody(account, details);
            })
            .then(function(mailbody) {
                return _sendmail(mailbody);
            });
    }

    function sendWeeklyReports() {
        return dbHelper.account.queryAll()
            .then(function(result) {
                return Promise.all(
                    result.map(function(account) {
                        //return sendWeeklyReport(account.name);
                        return _sendWeeklyReportBatch(account);
                    })
                );
            })
            .then(function() {
                return Promise.resolve("Sent reports complate");
            });
    }


    MailHelper.prototype._getMailBody = _getMailBody; // For test
    MailHelper.prototype._getExpense = _getExpense; // For test
    // MailHelper.prototype._getDisplayDetails = _getDisplayDetails;// For test

    MailHelper.prototype.sendWeeklyReport = sendWeeklyReport;
    MailHelper.prototype.sendWeeklyReports = sendWeeklyReports;

    module.exports.mailHelper = function(option) {
        return new MailHelper(option);
    };
})();