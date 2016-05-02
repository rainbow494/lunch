
var express = require('express');
var router = express.Router();

var util = require('../util');
var dbHelper = require('../mongodbExecutor.js').mongdbExecutor();

router.get('/api/weather/queryWeathersByDate', function (req, res, next) {
    var startDate = req.query.startdate || util.getDefaultStartDate();
    var endDate = req.query.enddate || util.getToday();

    dbHelper.weather.queryByDate(startDate, endDate)
    .then(function (result) {
        res.json(result);
    })
    .catch (next);
});

module.exports = router;
