;
(function () {
    var Promise = require("bluebird");
    var express = require('express');

    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var Collection = mongodb.Collection;

    Promise.promisifyAll(Collection.prototype);
    Promise.promisifyAll(MongoClient);

	Collection.prototype._find = Collection.prototype.find;
    Collection.prototype.find = function () {
        var cursor = this._find.apply(this, arguments);
        cursor.toArrayAsync = Promise.promisify(cursor.toArray, cursor);
        cursor.countAsync = Promise.promisify(cursor.count, cursor);
        return cursor;
    }

    _queryData = function (expression) {
        var _url = 'mongodb://localhost:27017/test';

        return MongoClient.connectAsync(_url);
    };

    _querySummary = function (db) {
        var collection = db.collection('lunch');
        return collection.find({},{name:1, account:1}).toArrayAsync();
        //return collection.findAsync({})
    }

    //-----------------------------------------------------------------------

    var app = express();

    app.get('/api/test', function (req, res) {
        res.send('Api is working!');
    });

    app.get('/api/lunch/summary', function (req, res) {
        _queryData()
        .then(_querySummary)
        .then(function (result) {
            res.json(result);
        })
        .catch (function (err) {
            console.log(err);
        });

    })

    // app.get('/?', function (req, res) {
    // res.send('Incorrect request!');
    // })
	
	app.use(express.static('../webSite'));

    var server = app.listen(3000, function () {

            var host = server.address().address;
            var port = server.address().port;

            console.log('Example app listening at http://%s:%s', host, port);
        })
})()
