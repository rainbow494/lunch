;
(function () {
    var express = require('express');
    var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

    var findData = function (db, callback) {
        // Get the documents collection
        var collection = db.collection('lunch');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            //assert.equal(2, docs.length);
            console.log("Found the following records");
            //console.dir(docs);
            //console.log(docs);
            callback(docs);
        });
    }

    var data;
    var url = 'mongodb://localhost:27017/test';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        findData(db, function (doc) {
            console.log(doc);
            data = doc;
            db.close();
        });
        //db.close();
    });

    var app = express()

    app.get('/test', function (req, res) {
        res.send('Api is working!');
    });
    app.get('/lunch', function (req, res) {
        res.send(data);
    })

    // app.get('/?', function (req, res) {
    // res.send('Incorrect request!');
    // })

    var server = app.listen(3000, function () {

            var host = server.address().address;
            var port = server.address().port;

            console.log('Example app listening at http://%s:%s', host, port);
        })
})()
