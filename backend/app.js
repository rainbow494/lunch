(function () {
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

    app.get('/api/lunch/summary', function (req, res, next) {
        dbHelper.queryAccountAll()
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.post('/api/lunch/updateAccountByAmount', function (req, res, next) { // jshint ignore:line
        // var name = req.body.name;
        // var amount = parseInt(req.body.account || 0);
        // dbHelper.updateAccountByAmount(name, amount)
        // .then(function (result) {
        // res.json(result);
        // })
        // .catch (next);
        res.json("this api is deprecated!");
    });

    app.get('/api/lunch/queryAccountByName:name?', function (req, res, next) {
        var accountName = req.query.name || 'paul';

        dbHelper.queryAccountByName(accountName)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.get('/api/detail/queryDetailsByName:name?', function (req, res, next) {
        var accountName = req.query.name || 'paul';

        dbHelper.queryDetailsByName(accountName)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    // app.post('/api/lunch/updateDetail', function (req, res, next) {
    // dbHelper.queryDetailAmountExecutor(req.body.id)
    // .then(function () {
    // var detailObj = arguments[0];
    // var inc = parseInt(req.body.amount) - detailObj.amount;
    // return dbHelper.updateAccountByIncExecutor(detailObj.name, inc);
    // })
    // .then(function () {
    // console.log(JSON.stringify(arguments));
    // return dbHelper.updateDetail(req.body.id, req.body.amount);
    // })
    // .then(function (result) {
    // res.json(result);
    // })
    // .catch (next);
    // });

    app.post('/api/lunch/updateDetail', function (req, res, next) {
        var id = parseInt(req.body.id);
        var amount = parseInt(req.body.amount || 0);

        dbHelper.updateDetailAndAccount(id, amount)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.post('/api/lunch/insertDetail', function (req, res, next) {
        var name = req.body.name;
        var date = req.body.date;
        var amount = parseInt(req.body.amount || 0);

        dbHelper.insertDetailAndUpdateAccount(name, date, amount)
        .then(function (result) {
            res.json(result);
        })
        .catch (next);
    });

    app.use(express.static('../webSite', {
            index : 'index.html'
        }));

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
