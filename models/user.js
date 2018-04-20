var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var FriendSchema = mongoose.Schema({
	name : {
		type : String
	},
	email: {
		type : String
	},
	action:{
		type : String
	},
	amount : {
		type: Number,
		integer : true
	}
})

// User Schema
var UserSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	phone_no: {
		type: String
	},
	email: {
		type: String,
        unique: true
	},
	password: {
		type: String
	},
	notification :[{

		to_user: {      //Email of reciever
			type:String
		},
		from_user:{    //Email of sender
			type:String
		},
		message:{
			type:String
		},
		bill_id:{
			type: mongoose.Schema.Types.ObjectId
		}

	}],
	groups: [mongoose.Schema.Types.ObjectId],
	friend:[FriendSchema]
});

UserSchema.plugin(uniqueValidator);
var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
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
