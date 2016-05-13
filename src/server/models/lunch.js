
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var LunchSchema = new Schema({
    name: String,
    account: Number,
    mail: String,
    group: String,
    username: String,
    password: String,
    role: String
},
{
    collection: 'lunch'
});

LunchSchema.methods.getGroup = function() {
    return this.group;
};

LunchSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

LunchSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('lunch', LunchSchema);
