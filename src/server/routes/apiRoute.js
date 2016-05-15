
var express = require('express');
var router = express.Router();

var util = require('../util');

var dbHelper = require('../mongodbExecutor.js').mongdbExecutor();

var isAuthenticated = function (req,res,next) {
    if (req.isAuthenticated()) return next();
    res.redirect(203, 'http://<aws.hostname>:<aws.webserver.port>/login');
};

var isAdmin = function (req,res,next) {
    if (req.isAuthenticated() && req.user.isAdmin()) return next();
    res.redirect(203, 'http://<aws.hostname>:<aws.webserver.port>/login');
};
router.get('/api/lunch/*', isAuthenticated ,function(req, res, next){
    next();
});

router.post('/api/lunch/*', isAdmin ,function(req, res, next){
    next();
});

router.get('/api/lunch/summary', function (req, res, next) {
    dbHelper.account.queryAll()
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.get('/api/lunch/queryAccountByName:name?', function (req, res, next) {
    var accountName = req.query.name || 'paul';

    dbHelper.account.queryByName(accountName)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.post('/api/lunch/updateAccountByAmount', function (req, res, next) { // jshint ignore:line
    var name = req.body.name;
    var amount = parseFloat(req.body.account || 0);
    dbHelper.account.updateByAmount(name, amount)
    .then(function (result) {
    res.json(result);
    })
    .catch (next);
    //res.json("this api is deprecated!");
});

router.get('/api/detail/queryDetailsByName', function (req, res, next) { // jshint ignore:line
    var accountName = req.query.name || 'paul';
    res.redirect('/api/detail/queryDetailsByNameAndDate?name=' + accountName);
});

router.get('/api/detail/queryDetailsByNameAndDate', function (req, res, next) {
    var accountName = req.query.name || 'paul';
    var startDate = req.query.startdate || util.getDefaultStartDate();
    var endDate = req.query.enddate || util.getToday();

    dbHelper.detail.queryByNameAndDate(accountName, startDate, endDate)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.post('/api/lunch/insertDetail', function (req, res, next) {
    var name = req.body.name;
    var date = req.body.date;
    var amount = parseFloat(req.body.amount || 0);

    dbHelper.detail.insert(name, date, amount)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.post('/api/lunch/updateDetail', function (req, res, next) {
    var id = parseInt(req.body.id);
    var amount = parseFloat(req.body.amount || 0);

    dbHelper.detail.update(id, amount)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

module.exports = router;
