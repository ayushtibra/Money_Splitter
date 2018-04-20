var express = require('express');
var router = express.Router();
var Group = require('../models/group');

// Get Homepage
router.get('/',ensureAuthenticated, function(req, res){
	var GroupQuery = {_id:{$in :req.user.groups}};

	Group.find(GroupQuery,function(err,group){
		res.render('index',{
			group : group,
            friend: req.user.friend,
			css: ['dashboard.css', 'bootstrap.css','dashboardimage.css']
		});
	});
	
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;