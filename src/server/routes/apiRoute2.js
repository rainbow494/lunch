
var express = require('express');
var router = express.Router();

var util = require('../util');

var dbHelper2 = require('../mongodbExecutor2.js');
var dbHelper = require('../mongodbExecutor.js').mongdbExecutor();

router.get('/api/lunch/summary2', function (req, res, next) {
    dbHelper2.findAll(req.user)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.get('/api/lunch/userManager', function (req, res, next) {
    dbHelper2.userManager(req.user)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

router.post('/api/lunch/updateAccountMail', function (req, res, next) {
    var id = req.body.id;
    var mail = req.body.mail;

    dbHelper2.updateAccountMail(req.user, id, mail)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});


router.post('/api/lunch/updateDetail2', function (req, res, next) {
    var id = req.body.id;
    var date = req.body.date;
    var amount = parseFloat(req.body.amount || 0);

    dbHelper2.updateDetail(id, amount, date)
    .then(function (result) {
        dbHelper.script.updateLunchAmount();
        res.json('update detail sucess');
    })
    .catch (next);
});

router.post('/api/lunch/insertDetail2', function (req, res, next) {

    var detail = {
        name : req.body.name,
        date : req.body.date,
        amount : parseFloat(req.body.amount || 0),
        group: req.user.group
    };

    dbHelper2.insertDetail(detail)
    .then(function (result) {
        dbHelper.script.updateLunchAmount();
        res.json('insert detail sucess');
    })
    .catch (next);
});

router.post('/api/lunch/insertDetails2', function (req, res, next) {
    var tmp = req.body.details;
    tmp = JSON.parse(tmp);
    var details = tmp.map(function(detail) {
        return {
            name: detail.name,
            date: detail.date,
            amount: parseFloat(detail.amount || 0),
            group: req.user.group
        };
    });

    dbHelper2.insertDetails(details)
    .then(function (result) {
        return dbHelper.script.updateLunchAmount();
    })
    .then(function() {
        res.json('insert detail sucess');
    })
    .catch (next);
});

// Proxy Api
var request = require('request');
var mailServerUrl = 'http://<aws.hostname>:<aws.mailserver.port>/api/';
router.get('/api/lunch/sendTestMail', function (req, res, next) {
    var name = req.query.name;

    console.log('sendTestMail' + name);

    var url = mailServerUrl + "sendReportImmediately?name=" + name;
    req.pipe(request(url)).pipe(res);
});

module.exports = router;
