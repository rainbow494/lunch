var express = require('express');
var router = express.Router();

var util = require('../util');

var dbHelper2 = require('../mongodbExecutor2.js');

router.get('/api/weixin/account/:username', function(req, res, next) {
    dbHelper2.findAll({ username: req.params.username })
        .then(function(result) {
            console.log(result);
            res.json(result);
        })
        .catch(next);
});

module.exports = router;