var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    id: String,
    email: String,
    password: String,
    user_type: String
});

module.exports = mongoose.model('User', User);