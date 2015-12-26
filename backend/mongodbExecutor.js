(function () {

	var Promise = require('bluebird');
	var mongodb = require('mongodb');

	var _defaultDbConnectionString = 'mongodb://<mongodb.hostname>:<mongodb.port>/<mongodb.dbname>';
	var _lunchCollection = 'lunch';

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
		account = account && !isNaN(account) ? account : 0;
		var collection = db.collection(_lunchCollection);
		return collection.updateOneAsync({
			name : name
		}, {
			$set : {
				account : account
			}
		});
	}

	exports.mongdbExecutor = function (db) {
		return new MongdbExecutor(db);
	};

	process.on('uncaughtException', function (err) {
		console.log('server is broken by unhandle exception : ' + err);
	});
})();
