
var express = require('express');
var router = express.Router();

var util = require('../util');

var dbHelper2 = require('../mongodbExecutor2.js');
var dbHelper = require('../mongodbExecutor.js').mongdbExecutor();

router.post('/api/lunch/updateDetail2', function (req, res, next) {
    var id = parseInt(req.body.id);
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

module.exports = router;
