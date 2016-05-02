
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');

var weatherRoute = require('./routes/weatherRoute');
var apiRoute = require('./routes/apiRoute');
var apiRoute2 = require('./routes/apiRoute2');

var app = express();
app.use(bodyParser.urlencoded({
        extended : false
    }));

app.get('/api/test', function (req, res) {
    res.send('Api is working!\n' +
        'api/lunch/summary \n' +
        'api/lunch/updateAccountByAmount \n');
});

app.use('/',
    weatherRoute,
    apiRoute,
    apiRoute2
);

console.log(__dirname);
console.log(path.resolve(__dirname, '../webSite'));

app.use(express.static(path.resolve(__dirname, '../webSite'), {
        index : 'index.html'
    }));

// app.use(favicon(__dirname + '/favicon.ico'));
app.use(favicon(path.resolve(__dirname, '../webSite/favicon.ico')));

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
