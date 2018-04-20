var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// User Schema
var BillSchema = mongoose.Schema({
    description :{
        type: String
    },

});

var User = module.exports = mongoose.model('User', BillSchema);

module.exports.createUser = function(newUser, callback){

}

module.exports.getUserByUsername = function(username, callback){
    var query = {email: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

