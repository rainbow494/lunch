(function () {

    var Promise = require('bluebird');
    var mongodb = require('mongodb');

    var _defaultDbConnectionString = 'mongodb://<mongodb.hostname>:<mongodb.port>/<mongodb.dbname>';
    var _lunchCollection = 'lunch';
    var _detailCollection = 'detail';
    var _weatherCollection = 'weather';

    var MongoClient = mongodb.MongoClient;
    var Collection = mongodb.Collection;

    Promise.promisifyAll(Collection.prototype);
    Promise.promisifyAll(MongoClient);
    // todo: promiseify db.eval here

    Collection.prototype._find = Collection.prototype.find;
    Collection.prototype.find = function () {
        var cursor = this._find.apply(this, arguments);
        cursor.toArrayAsync = Promise.promisify(cursor.toArray, cursor);
        cursor.countAsync = Promise.promisify(cursor.count, cursor);
        return cursor;
    };

    var MongdbExecutor = function (dbConnectionString) {

        var _dbConnectionString = dbConnectionString || _defaultDbConnectionString;
        var mongo;

        this.account = {
            queryAll : function () {
                mongo.dbExecutor = _queryAccountAll;
                return mongo.process.apply(mongo, arguments);
            },
            queryByName : function () {
                mongo.dbExecutor = _queryAccountByName;
                return mongo.process.apply(mongo, arguments);
            },
            updateByAmount : function () {
                mongo.dbExecutor = _updateAccountByAmount;
                return mongo.process.apply(mongo, arguments);
            }
        };

        this.detail = {
            // queryByName : function () {
                // mongo.dbExecutor = _queryDetailsByName;
                // return mongo.process.apply(mongo, arguments);
            // },
            queryByNameAndDate : function () {
                mongo.dbExecutor = _queryDetailsByNameAndDate;
                return mongo.process.apply(mongo, arguments);
            },
            insert : function () {
                mongo.dbExecutor = _insertDetailAndUpdateAccount;
                return mongo.process.apply(mongo, arguments);
            },
            update : function () {
                mongo.dbExecutor = _updateDetailAndAccount;
                return mongo.process.apply(mongo, arguments);
            }
        };

        this.weather = {
            queryByDate : function () {
                mongo.dbExecutor = _queryWeatherByDate;
                return mongo.process.apply(mongo, arguments);
            },
            insert :  function () {
                mongo.dbExecutor = _insertWeather;
                return mongo.process.apply(mongo, arguments);
            }
        };

        var mongoStore = {
            dbExecutor : function () {
                return Promise.reject('not init executor!');
            },
            process : function () {
                var self = this;
                self.db = null;

                var mainArguments = Array.prototype.slice.call(arguments);
                return _getDb(_dbConnectionString).then(function (db) {
                    self.db = db;
                    mainArguments.splice(0, 0, db);
                    return self.dbExecutor.apply(null, mainArguments);
                })
                .catch (function (err) {
                    console.log('failed to executor mongoDB');
                    return Promise.reject(err);
                })
                .finally (function () {
                    if (self.db) {
                        self.db.close();
                    }
                });
            }
        };

        mongo = inherit(mongoStore);

        function inherit(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        }
    };

    function _getDb(connectionString) {
        return MongoClient.connectAsync(connectionString)
        .catch (function (err) {
            console.log('failed to _getDb');
            return Promise.reject(err);
        });
    }

    // Lunch Collection
    function _queryAccountAll(db) {
        var collection = db.collection(_lunchCollection);
        return collection.find({}, {
            name : 1,
            account : 1,
            mail : 1,
        }).toArrayAsync();
    }

    function _queryAccountByName(db, name) {
        var collection = db.collection(_lunchCollection);
        return collection.find({
            name : name
        }, {
            name : 1,
            account : 1,
            mail : 1,
        }).toArrayAsync();
    }

    function _updateAccountByAmount(db, name, amount) {
        var collection = db.collection(_lunchCollection);
        return collection.updateOneAsync({
            name : name
        }, {
            $set : {
                account : amount
            }
        });
    }

    function _updateAccountByInc(db, name, inc) {
        var lunchCollection = db.collection(_lunchCollection);
        return lunchCollection.updateOneAsync({
            name : name
        }, {
            $inc : {
                account : inc
            }
        });
    }

    // Detail Collection
    function _insertDetail(db, name, date, amount) {
        var detailCollection = db.collection(_detailCollection);
        return _queryAndIncDetailSeq(db)
        .then(
            function () {
            var newSeq = arguments[0];
            return detailCollection.insertAsync({
                _id : newSeq,
                name : name,
                amount : amount,
                date : new Date(date)
            });
        });
    }

    function _queryAndIncDetailSeq(db) {
        db.evalAsync = Promise.promisify(db.eval);
        return db.evalAsync('getNextSequence("detail_seq")');
    }

    function _queryDetailById(db, id) {
        var collection = db.collection(_detailCollection);
        return collection.findOneAsync({
            _id : id
        });
    }

    // function _queryDetailsByName(db, name) {
        // var collection = db.collection(_detailCollection);
        // return collection.find({
            // name : name
        // }).toArrayAsync();
    // }

    function _queryDetailsByNameAndDate(db, name, startDate, endDate) {
        var collection = db.collection(_detailCollection);
        return collection.find({
            name : name,
            date : {
                $gte : new Date(startDate),
                $lte : new Date(endDate)
            }
        }).sort({
            date : 1,
            _id : 1
        }).toArrayAsync();
    }

    function _updateDetail(db, id, amount) {
        var detailCollection = db.collection(_detailCollection);
        return detailCollection.updateOneAsync({
            _id : id
        }, {
            $set : {
                amount : amount
            }
        });
    }

    function _insertDetailAndUpdateAccount(db, name, date, amount) {
        return _insertDetail(db, name, date, amount)
        .then(function () {
            return _updateAccountByInc(db, name, amount);
        });
    }

    function _updateDetailAndAccount(db, id, amount) {
        return _queryDetailById(db, id)
        .then(function () {
            var detail = arguments[0];
            var name = detail.name;
            var inc = amount - detail.amount;
            return _updateAccountByInc(db, name, inc);
        })
        .then(function () {
            return _updateDetail(db, id, amount);
        });
    }

    // function _queryLastDetailExecutor(db, name) {
    // var detailCollection = db.collection(_detailCollection);
    // return detailCollection.find({
    // name : name
    // }).sort({
    // _id : -1
    // })
    // .limit(1).toArrayAsync();
    // }

    function _queryWeatherByDate(db, startDate, endDate) {
        var collection = db.collection(_weatherCollection);
        return collection.find({
            date : {
                $gte : new Date(startDate),
                $lte : new Date(endDate)
            }
        }).sort({
            date : 1
        }).toArrayAsync();
    }

    function _insertWeather(db, weatherReport) {
        var weatherCollection = db.collection(_weatherCollection);
        return weatherCollection.insertAsync({
            date : new Date(weatherReport.date),
            high : weatherReport.high,
            low : weatherReport.low,
            text : weatherReport.text
        });
    }

    exports.mongdbExecutor = function (db) {
        return new MongdbExecutor(db);
    };

    process.on('uncaughtException', function (err) {
        console.log('server is broken by unhandle exception : ' + err);
    });
})();
