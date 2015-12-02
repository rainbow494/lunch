(function() {
    var url = require('url'),
        express = require('express'),
        bodyParser = require('body-parser'),
        mailHelper = require('./mailHelper.js').mailHelper();

    var app = express(),
        jsonParser = bodyParser.json();

    app.use(bodyParser.json());
    app.get('/api/test', jsonParser, function(req, res) {
        console.log('test');
        res.send('test success');
    });

    app.get('/api/sendReportImmediately', jsonParser, function(req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var accountName = query.name || 'paul';

        mailHelper.sendReport(accountName).then(function(){
                res.send('Have sent mail to:' + accountName);
    });
    });

    app.get('/api/sendWeeklyReportsImmediately', jsonParser, function(req, res) {
        mailHelper.sendWeeklyReports().then(function(){
                res.send('Weekly report sent');
    });
    });

    var server = app.listen(12333, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Mail Service listining at http://%s:%s', host, port);
    });
})();