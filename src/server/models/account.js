
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    group: String,
    role: String
},
{
    collection: 'Account'
});

Account.methods.getGroup = function() {
    return this.group;
};

Account.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
