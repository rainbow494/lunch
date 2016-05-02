var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LunchSchema = new Schema({
    name: String,
    account: Number,
    mail: String,
    group: String
},
{
    collection: 'lunch'
});

module.exports = mongoose.model('lunch', LunchSchema);
