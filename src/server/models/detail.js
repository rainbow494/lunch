var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailSchema = new Schema({
    name: String,
    amount: Number,
    date:Date,
    group:String
},{
    collection:'detail'
});

module.exports = mongoose.model('detail', DetailSchema);
