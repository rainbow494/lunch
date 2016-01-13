//Todo 1: init mailgun when mail helper init and use mailgun
//Todo 2: call send mail function by promise way
//Todo 3: display send mail response correct.
(function () {
    var Promise = require('bluebird'),
    mailgunGen = require('mailgun-js'),
    moment = require('moment'),
    util = require('./util'),
    dbHelper = require('./mongodbExecutor.js').mongdbExecutor(),
    mailTmpToHtml = require('./mailTmpToHtml.js').mailTmpToHtml();

    var defaultMailApiConfig = {
        apiKey : '<mailgun.api_key>',
        domain : '<mailgun.domain>'
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
        from : 'rainbow494@qq.com',
        to : 'rainbow494@gmail.com',
        subject : '午饭小组',
        text : '',
        html : ''
    };

    var config = {
        detailLink : 'http://<aws.hostname>:<aws.webserver.port>/index.html'
    };

    MailHelper.prototype._getMailBody = _getMailBody;
	MailHelper.prototype._getExpense = _getExpense;// For TEst
	// MailHelper.prototype._getDisplayDetails = _getDisplayDetails;// For TEst

    MailHelper.prototype.sendWeeklyReport = sendWeeklyReport;

    MailHelper.prototype.sendWeeklyReports = sendWeeklyReports;

    function _getMailBody(account, details) {

        var data = defaultSender;

        if (account.mail)
            data.to = account.mail;

        var mailBodyData = {
			'date' : util.getZhDate(),
            'name' : account.name,
            'account' : account.account,
            'details' : _getDisplayDetails(details),
			'expense': _getExpense(details),
            'detailLink' : config.detailLink,
        };
		//console.log(JSON.stringify(mailBodyData));
        var mailbody = mailTmpToHtml.CreateMailBody(mailBodyData);
        data.html = mailbody;

        return Promise.resolve(data);
    }

    function _getDisplayDetails(details) {
        var displayDetails = [];
        displayDetails = details.map(function (detail) {
                var displayDate = util.convertDBDateToDate(detail.date);
                var weekDay = util.getWeekdayOfDate(displayDate);
                return {
                    'displayDate' : displayDate,
                    'weekDay' : weekDay,
                    'amount' : detail.amount
                }
            });
        return displayDetails;
    };
	
	function _getExpense(details) {
        var expense = 0;
		if (details.length > 0)
			details.map(function (detail) {
				if(detail.amount < 0)
					expense += detail.amount;
            });
			
        return expense;
    };

    function _sendmail(mailbody, mailgun) {
        //Todo: Call send method by promise pattern
        //Promise.promisifyAll(mailgun.messages().send);

        mailgun = mailgunGen({
                apiKey : defaultMailApiConfig.apiKey,
                domain : defaultMailApiConfig.domain
            });

        //Todo 3: display send mail response correct.
        mailgun.messages().send(mailbody, function (error, result) {
            if (error) {
                console.log('Error : ' + error);
            }
            if (result) {
                console.log('Resp : ' + result[0]);
            }
        });
    }

    function sendWeeklyReport(accountName) {

        var account = {};
        var details = [];
        var startDate = util.getWeekStart();
        var endDate = util.getWeekEnd();

        return dbHelper.account.queryByName(accountName)
        .then(function (result) {
            account = result[0];
            return dbHelper.detail.queryByNameAndDate(account.name, startDate, endDate);
        })
        .then(function (result) {
            details = result;
            return _getMailBody(account, details);
        })
        .then(_sendmail);
    }

    function sendWeeklyReports() {
        return dbHelper.account.queryAll()
        .then(function (result) {
            result.forEach(function (account) {
                sendWeeklyReport(account.name);
            });
        });
    };

    module.exports.mailHelper = function (option) {
        return new MailHelper(option);
    };
})();
