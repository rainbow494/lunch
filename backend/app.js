(function () {
    var express = require('express');
    var bodyParser = require('body-parser');
    var favicon = require('serve-favicon');
	//var moment = require('moment');

	var util = require('./util');
    //var dbConnection = 'mongodb://localhost:27017/test';
    //var dbHelper = require('./mongodbExecutor.js').mongdbExecutor(dbConnection);
    var dbHelper = require('./mongodbExecutor.js').mongdbExecutor();

    var app = express();
    app.use(bodyParser.urlencoded({
            extended : false
        }));

    app.get('/api/test', function (req, res) {
        res.send('Api is working!\n' +
            'api/lunch/summary \n' +
            'api/lunch/updateAccountByAmount \n' +
            '\n' +
            '\n' +
            '\n' +
            '\n' +
            '\n');
    });

    app.get('/api/lunch/summary', function (req, res, next) {
        dbHelper.account.queryAll()
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.get('/api/lunch/queryAccountByName:name?', function (req, res, next) {
        var accountName = req.query.name || 'paul';

        dbHelper.account.queryByName(accountName)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.post('/api/lunch/updateAccountByAmount', function (req, res, next) { // jshint ignore:line
        var name = req.body.name;
        var amount = parseFloat(req.body.account || 0);
        dbHelper.account.updateByAmount(name, amount)
        .then(function (result) {
        res.json(result);
        })
        .catch (next);
        //res.json("this api is deprecated!");
    });

    app.get('/api/detail/queryDetailsByName', function (req, res, next) { // jshint ignore:line
        var accountName = req.query.name || 'paul';
		res.redirect('/api/detail/queryDetailsByNameAndDate?name=' + accountName);
    });

    app.get('/api/detail/queryDetailsByNameAndDate', function (req, res, next) {
        var accountName = req.query.name || 'paul';
        var startDate = req.query.startdate || util.getDefaultStartDate();
        var endDate = req.query.enddate || util.getToday();

        dbHelper.detail.queryByNameAndDate(accountName, startDate, endDate)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.post('/api/lunch/insertDetail', function (req, res, next) {
        var name = req.body.name;
        var date = req.body.date;
        var amount = parseFloat(req.body.amount || 0);

        dbHelper.detail.insert(name, date, amount)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.post('/api/lunch/updateDetail', function (req, res, next) {
        var id = parseInt(req.body.id);
        var amount = parseFloat(req.body.amount || 0);

        dbHelper.detail.update(id, amount)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.get('/api/weather/queryWeathersByDate', function (req, res, next) {
        var startDate = req.query.startdate || util.getDefaultStartDate();
        var endDate = req.query.enddate || util.getToday();

        dbHelper.weather.queryByDate(startDate, endDate)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.use(express.static('../webSite', {
            index : 'index.html'
        }));

    // app.use(favicon(__dirname + '/favicon.ico'));
    app.use(favicon('../webSite/favicon.ico'));

    app.use(function (req, res) {
        res.send('404: Page not Found', 404);
    });

    app.use(function (err, req, res, next) { // jshint ignore:line
        console.log('error hanlde');
        console.log(err.stack);
        res.status(500).send('web server is broken! Please check the log!');
    });

    var server = app.listen(3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s', host, port);
        });

    process.on('uncaughtException', function (err) {
        console.log('server is broken by unhandle exception : ' + err);
    });
})();
