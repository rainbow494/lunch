(function () {
    var url = require('url');
    var express = require('express');
    var bodyParser = require('body-parser');
    var mailHelper = require('./mailHelper.js').mailHelper();
    var app = express(),
    //var domainMiddleware = require('domain-middleware');

    jsonParser = bodyParser.json();

    app.use(bodyParser.json());

    app.get('/api/test', jsonParser, function (req, res) {
        // throw new Excepton('a');
        console.log('test');
        res.send('test success\n\r /api/sendReportImmediately');
    });

    app.get('/api/sendReportImmediately', jsonParser, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var accountName = query.name || 'paul';

        mailHelper.sendReport(accountName).then(function () {
            res.send('Have sent mail to:' + accountName);
        });
    });

    app.get('/api/sendWeeklyReportsImmediately', jsonParser, function (req, res) {
        mailHelper.sendWeeklyReports().then(function () {
            res.send('Weekly report sent');
        });
    });

    app.use(function (err, req, res, next) {
        console.log(err.stack);
        res.status(500).send('Something broke!');
    });

    var server = app.listen('<aws.mailserver.port>', function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Mail Service listining at http://%s:%s', host, port);
        });

    process.on('uncaughtException', function (err) {
        console.log("hello exception");
    });
})();
