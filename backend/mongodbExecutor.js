(function () {

    var Promise = require('bluebird');
    var mongodb = require('mongodb');

    var _defaultDbConnectionString = 'mongodb://<mongodb.hostname>:<mongodb.port>/<mongodb.dbname>';
    var _lunchCollection = 'lunch';
    var _detailCollection = 'detail';

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
    };

    var MongdbExecutor = function (dbConnectionString) {

        var _dbConnectionString = dbConnectionString || _defaultDbConnectionString;

        function _getDb() {
            return MongoClient.connectAsync(_dbConnectionString)
            .catch (function (err) {
                console.log('failed to _getDb');
                return Promise.reject(err);
            });
        }

        this.querySummary = function () {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _querySummaryExecutor;
            return mongo.process();
        };

        this.queryAccountByName = function (name) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _queryAccountByNameExecutor;
            return mongo.process(name);
        };

        this.updateAccount = function (name, account) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _updateAccountExecutor;
            return mongo.process(name, account);
        };

        this.queryDetailByName = function (name) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _queryDetailExecutor;
            return mongo.process(name);
        };

        this.updateDetail = function (id, amount) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _updateDetailExecutor;
            return mongo.process(id, amount);
        };

        this.insertDetail = function (name, date, amount) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _insertDetailExecutor;
            return mongo.process(name, date, amount);
        };

        this.updateAccountByIncExecutor = function (name, amount) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _updateAccountByIncExecutor;
            return mongo.process(name, amount);
        };

        this.queryDetailAmountExecutor = function (id) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _queryDetailAmountExecutor;
            return mongo.process(id);
        };

        this.updateDetailAndAccount = function (id, amount) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _updateDetailAndAccountExecutor;
            return mongo.process(id, amount);
        };

        this.insertDetailAndUpdateAccount = function (name, date, amount) {
            var mongo = inherit(mongoStore);
            mongo.dbExecutor = _insertDetailAndUpdateAccountExecutor;
            return mongo.process(name, date, amount);
        };

        var mongoStore = {
            dbExecutor : function () {
                return Promise.reject('not init executor!');
            },
            process : function () {
                var self = this;
                self.db = null;

                var mainArguments = Array.prototype.slice.call(arguments);
                return _getDb().then(function (db) {
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

        function inherit(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        }
    };

    function _querySummaryExecutor(db) {
        var collection = db.collection(_lunchCollection);
        return collection.find({}, {
            name : 1,
            account : 1,
            mail : 1,
        }).toArrayAsync();
    }

    function _queryAccountByNameExecutor(db, name) {
        var collection = db.collection(_lunchCollection);
        return collection.find({
            name : name
        }, {
            name : 1,
            account : 1,
            mail : 1,
        }).toArrayAsync();
    }

    function _updateAccountExecutor(db, name, account) {
        account = account && !isNaN(account) ? parseInt(account) : 0;
        var collection = db.collection(_lunchCollection);
        return collection.updateOneAsync({
            name : name
        }, {
            $set : {
                account : account
            }
        });
    }

    function _queryDetailExecutor(db, name) {
        var collection = db.collection(_detailCollection);
        return collection.find({
            name : name
        }).toArrayAsync();
    }

    function _insertDetailExecutor(db, name, date, amount) {
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
        return db.evalAsync("getNextSequence('detail_seq')");
    }

    function _updateDetailExecutor(db, id, amount) {
        var detailCollection = db.collection(_detailCollection);
        return detailCollection.updateOneAsync({
            _id : id
        }, {
            $set : {
                amount : amount
            }
        });
    }

    function _queryDetailAmountExecutor(db, id) {
        var collection = db.collection(_detailCollection);
        return collection.findOneAsync({
            _id : id
        }, {
            amount : 1,
            name : 1
        });
    }

    function _updateAccountByIncExecutor(db, name, inc) {
        var lunchCollection = db.collection(_lunchCollection);
        return lunchCollection.updateOneAsync({
            name : name
        }, {
            $inc : {
                account : inc
            }
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

    function _updateDetailAndAccountExecutor(db, id, amount) {
        return _queryDetailAmountExecutor(db, id)
        .then(function () {
            var detail = arguments[0];
            var name = detail.name;
            var inc = amount - detail.amount;
            return _updateAccountByIncExecutor(db, name, inc);
        })
        .then(function () {
            return _updateDetailExecutor(db, id, amount);
        });
    }

    function _insertDetailAndUpdateAccountExecutor(db, name, date, amount) {
        return _insertDetailExecutor(db, name, date, amount)
        .then(function () {
            return _updateAccountByIncExecutor(db, name, amount);
        });
    }

    exports.mongdbExecutor = function (db) {
        return new MongdbExecutor(db);
    };

    process.on('uncaughtException', function (err) {
        console.log('server is broken by unhandle exception : ' + err);
    });
})();
