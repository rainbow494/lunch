(function () {
    var url = require('url');
    var express = require('express');
    var bodyParser = require('body-parser');
    
    //var dbConnection = 'mongodb://localhost:27017/test';
    //var dbHelper = require('./mongodbExecutor.js').mongdbExecutor(dbConnection);
    var dbHelper = require('./mongodbExecutor.js').mongdbExecutor();

    var app = express();
    app.use(bodyParser.urlencoded({
            extended : false
        }));

    app.get('/api/test', function (req, res) {
        res.send('Api is working!');
    });

    app.get('/api/lunch/summary', function (req, res) {
        dbHelper.querySummary()
        .then(function (result) {
            res.json(result);
        });
    });

    app.post('/api/lunch/updateAccount', function (req, res) {
        dbHelper.updateAccount(req.body.name, req.body.account)
        .then(function (result) {
            res.json(result);
        });
    });

    app.get('/api/lunch/queryAccountByName', function (req, res) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var accountName = query.name || 'paul';

        dbHelper.queryAccountByName(accountName)
        .then(function (result) {
            res.json(result);
        });
    });

    app.get('/api/?', function (req, res) {
        res.send('Incorrect request!');
    });

    app.use(express.static('../webSite'));

    var server = app.listen(3000, function () {

            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s', host, port);
        });
})();