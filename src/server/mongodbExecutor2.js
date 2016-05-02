var mongoose = require('mongoose');
var port = parseInt('<mongodb.port>');
var db = mongoose.connect('<mongodb.hostname>', port, '<mongodb.dbname>');

var LunchModel = require('./models/lunch');
var DetailModel = require('./models/detail');

function MongoExecutor2() {
    var db  = mongoose.connection;
    var self = this;
    self.LunchModel = LunchModel;
    self.DetailModel = DetailModel;

    db.on('error',console.error.bind(console,'连接错误:'));
    db.once('open',function(){
        console.log('connection open by MongoExecutor2');
    });
}

MongoExecutor2.prototype.findDetails = function(name, startDate, endDate){
    var self = this;
    var filterClause = { };
    if (name) filterClause.name = name;
    if (date) filterClause.date = new Date(date);

    return self.DetailModel.find(filterClause);
};

MongoExecutor2.prototype.insertDetail = function(name, date, amount){
    var self = this;
    var detail = {
        name: name,
        date: new Date(date),
        amount: amount
    };

    return self.DetailModel.create(detail);
};

MongoExecutor2.prototype.insertDetails = function(details){
    var self = this;
    var detail = {
        name: name,
        date: new Date(date),
        amount: amount
    };

    return self.DetailModel.create([detail,detail]);};

MongoExecutor2.prototype.updateDetail = function(_id, amount, date){
    var self = this;
    var filterClause = {};

    if (_id) filterClause._id = _id;

    var updateCluse = { $set: { }};
    if (amount) updateCluse.$set.amount = amount;
    if (date) updateCluse.$set.date = new Date(date);

	return self.DetailModel.update(filterClause, updateCluse).exec();
};

MongoExecutor2.prototype.updateLunch = function(name, amount, mail){
    var filterClause = {};
    if (_id) filterClause._id = _id;

    return self.ArchModel.update(filterClause, updateCluse).exec();
};



var MongoExecutor2 = new MongoExecutor2();
module.exports = MongoExecutor2;
