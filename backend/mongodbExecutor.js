;
(function () {

    var Promise = require("bluebird"),
    mongodb = require('mongodb');

    var _defaultDbConnection = 'mongodb://localhost:27017/test';
    var _lunchCollection = 'lunch';

    function MongdbExecutor(dbConnection) {

        var _dbConnection = dbConnection || _defaultDbConnection;

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

        _getDb = function () {
            return MongoClient.connectAsync(_dbConnection);
        };

        _querySummaryExecutor = function (db) {
            var collection = db.collection(_lunchCollection);
            return collection.find({}, {
                name : 1,
                account : 1,
                mail : 1,
            }).toArrayAsync();
        }

        _queryAccountByNameExecutor = function (db, name) {
            var collection = db.collection(_lunchCollection);
            return collection.find({
                name : name
            }, {
                name : 1,
                account : 1,
                mail : 1,
            }).toArrayAsync();
        }

        _updateAccountExecutor = function (db, name, account) {
            var collection = db.collection(_lunchCollection)
                return collection.updateOneAsync({
                    name : name
                }, {
                    $set : {
                        account : account
                    }
                });
        }

        //----------------------------------------
        // 利用apply数组化参数？？？？
        // NodeJs中 Templete的实现？or 策略模式的实现？
        // To do : abstractor code
        this.querySummary = function () {
            return _getDb().then(function (db) {
                return _querySummaryExecutor(db);
            })
            .catch (function (err) {
                console.log(err);
            });
        }

        // To do : abstractor code
        this.queryAccountByName = function (name) {
            return _getDb().then(function (db) {
                return _queryAccountByNameExecutor(db, name);
            })
            .catch (function (err) {
                console.log(err);
            });
        }

        // To do : abstractor code
        this.updateAccount = function (name, account) {
            return _getDb().then(function (db) {
                return _updateAccountExecutor(db, name, account);
            })
            .catch (function (err) {
                console.log(err);
            });
        }
        //----------------------------------------
    }

    exports.mongdbExecutor = function (db) {
        return new MongdbExecutor(db);
    }
})();
