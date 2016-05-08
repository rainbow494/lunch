
var express = require('express');
var router = express.Router();

var util = require('../util');

var dbHelper2 = require('../mongodbExecutor2.js');
var dbHelper = require('../mongodbExecutor.js').mongdbExecutor();

var isAuthenticated = function (req,res,next) {
    if (req.isAuthenticated()) return next();
    // res.writeHead(203, {location: '/login'});
    // res.end();
    res.redirect(203, {'redirect page:': 'http://localhost:3000/login'});
};
router.post('/api/lunch/*', isAuthenticated ,function(req, res, next){
    next();
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
    var name = req.body.name;
    var date = req.body.date;
    var amount = parseFloat(req.body.amount || 0);

    dbHelper2.insertDetail(name, date, amount)
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
            amount: parseFloat(detail.amount || 0)
        };
    });

    dbHelper2.insertDetails(details)
    .then(function (result) {
        dbHelper.script.updateLunchAmount();
        res.json('insert detail sucess');
    })
    .catch (next);
});

module.exports = router;
