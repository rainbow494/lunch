;
(function () {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var bodyParser = require('body-parser');
    var CronJob = require('cron').CronJob;
    
    var dbHelper = require('./mongodbExecutor.js').mongdbExecutor();
    
    var apiKey = 'key-ea2e3ab5ee11c200168588fc18acf3a3';
    var domain = '1234qwerasdf.com';
    //var apiBaseUrl = 'https://api.mailgun.net/v3/easyrun.hk';
    
    var mailgun = require('mailgun-js')({
        apiKey : apiKey,
        domain : domain
    });
    
    var defaultSender = {
        from : 'rainbow494@qq.com',
        to : 'rainbow494@gmail.com',
        subject : 'lunch team',
        text : '',
        detailLink : 'http://52.68.53.107:3000/index.html'
    };
    
    var getMailBody = function (accountName) {
        
        return dbHelper.queryAccountByName(accountName)
        .then(function (result) {
            var accountInfo = result[0];
            var data = defaultSender;
            
            data.to = accountInfo.mail;
            
            var replyMessage = [];
            replyMessage.push('Hi ' + accountName + ',');
            replyMessage.push(" ");
            replyMessage.push("At the end of this week, your account is " + accountInfo.account + ".");
            replyMessage.push("More detail can get from here ---- " + data.detailLink);
            replyMessage.push(" ");
            replyMessage.push("Regards, Lunch Team");
            data.text = replyMessage.join('\n\r');
            
            return data;
        })
        .catch (function (err) {
            console.log(err);
        });
    }
    
    var sendmail = function (data) {
        mailgun.messages().send(data, function (error, body) {
            if (error) {
                console.log('Error : ' + error);
            }
            
            if (body) {
                console.log('Mail Body : ' + body);
            }
        });
    }
    
    var app = express();
    var jsonParser = bodyParser.json();
    
    app.use(bodyParser.json())
    
    app.get('/api/test', jsonParser, function (req, res) {
        console.log('test');
        res.send('test success');
    })
    
    app.get('/api/sendReportImmediately', jsonParser, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var accountName = query.name || 'paul';
        
        getMailBody(accountName)
        .then(function (data) {
            sendmail(data);
            res.send('Mail Sent');
        });
        
    });
    
    app.get('/api/sendWeeklyReportsImmediately', jsonParser, function (req, res) {
        sendWeeklyReports();
    });
    
    var sendWeeklyReports = function() {
        
        dbHelper.querySummary()
        .then(function (result) {
            
            result.forEach(function (account) {
                getMailBody(account.name)
                .then(function (data) {
                    //sendmail(data);
                    console.log(data.to);
                    //res.send('Mail Sent');
                });
            })
        })
    }
    
    var server = app.listen(12333, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Mail Service listining at http://%s:%s', host, port);
    })
    
    var weeklyReportScheduleJob = new CronJob({
        cronTime : '00 30 13 * * 5',
        onTick : function () {
            sendWeeklyReports();
        },
        start : false,
        timeZone : "Asia/Shanghai"
    });
    weeklyReportScheduleJob.start();
    
    // try {
    // new CronJob('invalid cron pattern', function () {
    // console.log('this should not be printed');
    // })
    // } catch (ex) {
    // console.log("cron pattern not valid");
    // }
})()
