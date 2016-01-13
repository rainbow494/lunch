(function () {
    var express = require('express');
    var mailHelper = require('./mailHelper.js').mailHelper();

    var app = express();
    
    app.get('/api/test/', function (req, res) {
       res.send(' test success\n\r /api/sendReportImmediately');
    });

    app.get('/api/sendReportImmediately:name?', function (req, res, next) {
        var accountName = req.query.name || 'paul'; // req.params.b for a/:b

        mailHelper.sendWeeklyReport(accountName).then(function () {
            res.send('succeed to send mail to ' + accountName );
        })
        .catch (next);
    });

    app.get('/api/sendWeeklyReportsImmediately', function (req, res, next) {
        mailHelper.sendWeeklyReports().then(function () {
            res.send('Weekly report sent');
        })
        .catch (next);
    });

    app.get('/*', function (req, res) {
        res.send('Incorrect request!');
    });

    app.use(function (err, req, res, next) { // jshint ignore:line
        console.log(err.stack);
        res.status(500).send('mail server is broken! Please check the log');
    });

    var server = app.listen('<aws.mailserver.port>', function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Mail Service listining at http://%s:%s', host, port);
        });

    process.on('uncaughtException', function (err) {
        console.log('server is broken by unhandle exception : ' + err);
    });
})();
