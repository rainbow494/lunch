;
(function () {
    var Promise = require("bluebird");
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

    function MongdbExecutor() {
        this.queryData = function (arguments) {
            var _url = 'mongodb://localhost:27017/test';

            return MongoClient.connectAsync(_url);
        };

        this.querySummary = function (db) {
            var collection = db.collection('lunch');
            return collection.find({}, {
                name : 1,
                account : 1,
                mail:1,
            }).toArrayAsync();
        }

        this.queryAccountByName = function (db, name) {
            var collection = db.collection('lunch');
            return collection.find({
                name : name
            }, {
                name : 1,
                account : 1,
                mail:1,
                }).toArrayAsync();
        }

        this.updateAccount = function (db, name, account) {
            var collection = db.collection('lunch')
                return collection.updateOneAsync({
                    name : name
                }, {
                    $set : {
                        account : account
                    }
                });
        }
    }

    exports.mongdbExecutor = new MongdbExecutor();
})();
