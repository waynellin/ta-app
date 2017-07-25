var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoordinatorAccesKey = new Schema({
    id: String,
    key: String
});

module.exports = mongoose.model('CoordinatorAccesKey', CoordinatorAccesKey);
