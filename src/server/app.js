
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');

/* login start -------------------------------------*/

var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
// var port = parseInt('<mongodb.port>');
// mongoose.connect('<mongodb.hostname>', port, '<mongodb.dbname>');

/* login end -------------------------------------*/

var weatherRoute = require('./routes/weatherRoute');
var apiRoute = require('./routes/apiRoute');
var apiRoute2 = require('./routes/apiRoute2');
var accountRoute = require('./routes/accountRoute');

/* logic start */


app.use(bodyParser.urlencoded({
        extended : false
    }));

app.get('/api/test', function (req, res) {
    res.send('Api is working!');
});

app.use('/',
    weatherRoute,
    apiRoute,
    apiRoute2,
    accountRoute
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
