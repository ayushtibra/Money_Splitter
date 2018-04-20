
module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../models/user');
    var Group = require('../models/group');
    connections = [];
    // Register
    router.get('/register', function(req, res){
        res.render('register',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.get('/managerlogin', function(req, res){
        res.render('managerlogin',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.get('/manager', function(req, res){
        res.render('manager',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.post('/loginmanager',function (req,res) {
        var username = req.body.username;
        var password = req.body.password;

        console.log(username + ' ' + password);

        if(username == 'manager' && password == 'manager'){
            console.log(username + '' + password);


            res.redirect('/users/manager');

        }
        else{
            req.flash('error_msg', 'You have entered incorrect details');
            res.redirect('/users/managerlogin');
        }

    });

    router.get('/manager/report', function(req, res){
        res.render('report',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    // Login
    router.get('/login', function(req, res){
        res.render('login',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });
    router.post('/register', function(req, res){
        
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var phone_no = req.body.phone_no;
        var email = req.body.email;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;

        // Validation
        req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);
        req.checkBody('first_name','first name should contain only alphabets ').isAlpha();
        req.checkBody('last_name','last name should contain only alphabets ').isAlpha();
        req.checkBody('phone_no','phone no must be numericals').notEmpty().isInt();

        var errors = req.validationErrors();
        

        if(errors){
            res.render('register',{
                errors:errors,
                css: ['style.css', 'bootstrap.css','image.css']            
            });
        } else {
            var newUser = new User({
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                phone_no : req.body.phone_no,
                email : req.body.email,
                password : req.body.password
            });

            console.log(newUser);
            User.createUser(newUser, function(err, user){
                if(err){
                    console.log('ERROR');
                    res.render('register',{
                        errors:err});
                }
                else{
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/');
                }

                console.log(user);
            });


        }
    });
    
    router.post('/addgroup', function(req, res){
        
        var group_name = req.body.group_name;
        var group_description = req.body.group_description;

        var newgroup = new Group({
            name: req.body.group_name,
            description: req.body.group_description,
            owner : req.user.id,
            members :[req.user.id]
        });
        console.log(newgroup);
        Group.createGroup(newgroup, function(err, group){
            if(err){
                //console.log('ERROR' + err);
               // res.render('register',{
                //  errors:err});
                req.flash('error_msg', 'Please make sure that groupname alredy dose not exists.');
                res.redirect('/');
            }
            else{
                console.log(group);
                User.findOneAndUpdate({_id: req.user.id}, {$addToSet: {groups: group._id}},function(err,model){
                    if(err){

                        console.log(err);
                    }else{
                        console.log(model);

                    }

                });
                req.flash('success_msg', 'You have successfully craeted a  new group');
                res.redirect('/');
            }

        });
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
       User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
       });
      }));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.getUserById(id, function(err, user) {
        done(err, user);
      });
    });



    router.post('/login',passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),function(req, res) {

        res.redirect('/');
      });

    router.get('/logout', function(req, res){
        req.logout();

        req.flash('success_msg', 'You have successfully logged out');

        res.redirect('/users/login');
    });


     router.post('/addMember/:id',ensureAuthenticated, function(req, res){

        var groupId = req.params.id;
        var member_email = req.body.member_email;
       
       console.log(groupId);
       console.log(member_email);
       console.log(req);
        Group.getGroupById(groupId, function(err, mygroup){
            if(err){
                console.log("Error" + err);
                req.flash('error_msg', 'Something went wrong.Try again.');
                res.redirect('/users/group/' + groupId);
            }
            if(mygroup===null){
                console.log('ERROR group not found');
                req.flash('error_msg', 'No such group');
                res.redirect('/users/group/' + groupId);
            }
            else{
                console.log(mygroup);
                var flag =false;
                User.findOneAndUpdate({email : req.body.member_email}, {$addToSet: {groups: mygroup._id}},function(err,model){
                    if(err ){
                        console.log(err);
                        //res.render('register',{
                          //  errors:err});
                        req.flash('error_msg', 'Something went wrong. Try again');
                        res.redirect('/users/group/' + groupId);
                    }else  if(model===null){
                        console.log('ERROR:: User not found ');
                        req.flash('error_msg', 'No such user');
                        res.redirect('/users/group/' + groupId);

                    }else{
                        console.log(model);
                        Group.findOneAndUpdate({_id: mygroup._id}, {$addToSet: {members: model._id}},function(err,mygroup){
                            if(err){
                                req.flash('error_msg', 'Member cannot be added to group');
                                res.redirect('/users/group/' + groupId);
                                console.log(err);
                            }else{
                                console.log(mygroup);
                                req.flash('success_msg', 'Member added to group');
                                res.redirect('/users/group/' + groupId);
                            }
                        });
                    }
                });


            }
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
    router.post('/addFriend', function(req, res){


        var friend_email = req.body.friend_email;
        var already_friend =false;
        console.log(req.user._id);
        console.log(friend_email);
        for(var i =0;i<req.user.friend.length;i++){
            if(req.user.friend[i].email===friend_email)
                already_friend=true;
        }
        if(already_friend){
            req.flash('error_msg', 'User alredy in Contacts.');
            res.redirect('/');
        }else{
            User.getUserByUsername(req.body.friend_email,function(err, myuser){
                if(err){
                    console.log(err);
                    req.flash('error_msg', 'Something went wrong.Try again.');
                    res.redirect('/');
                }
                if(myuser===null){
                    console.log('ERROR user not found');
                    req.flash('error_msg', 'No such user');
                    res.redirect('/');
                }
                else{
                    console.log(myuser);

                    User.findOneAndUpdate({email : friend_email},
                                            {$push: {friend: {
                                                                name: req.user.first_name + " " + req.user.last_name,
                                                                email : req.user.email,
                                                                action : "life is good",
                                                                amount : 0
                                                            }
                                                        }
                                            },function(err,model){
                        if(err ){
                            console.log(err);
                            req.flash('error_msg', 'Something went wrong. Try again');
                            res.redirect('/');
                        }else  if(model===null){
                            console.log('ERROR:: User not found ');
                            req.flash('error_msg', 'No such user');
                            res.redirect('/');

                        }else{
                            console.log(model);

                            User.findOneAndUpdate({_id: req.user._id}, {$push: {friend: {
                                                                                            name: myuser.first_name +" "+ myuser.last_name,
                                                                                            email : myuser.email,
                                                                                            action : "life is good",
                                                                                            amount : 0
                                                                                        }
                                                                                }
                                                                        },function(err,mygroup){
                                if(err){
                                    req.flash('error_msg', 'User cannot be added to contacts');
                                    res.redirect('/');
                                    console.log(err);
                                }else{

                                    req.flash('success_msg', 'User added to contacts');
                                    res.redirect('/');
                                }
                            });
                        }
                    });


                }
            });
        }

    });


    router.get('/group/:id',ensureAuthenticated, function(req, res){
        var groupId = req.params.id;
        group_id = groupId;
        console.log(groupId);
        var GroupQuery = {_id:groupId};

        Group.getGroupById(groupId,function(err,group){
            if(err){
                console.log(err);
                req.flash('error_msg', 'Something went wrong.Try again.');
                res.redirect('/');
            }
            else if(group===null){
                console.log('ERROR user not found');
                req.flash('error_msg', 'No such group');
                res.redirect('/');
            }
            else{
                var memberQuery= {_id :{$in : group.members}};
                User.find(memberQuery,function (err,members) {
                    if(err){
                        console.log(err);
                        req.flash('error_msg', 'Something went wrong.Try again.');
                        res.redirect('/');
                    }
                    else {
                        console.log(members);
                        console.log(group.bills);
                        var option;
                        if(group.owner.equals(req.user._id)){
                            option= group_id;
                        }
                        else{
                            option =null;
                            console.log("owner " + group.owner + " user "+ req.user._id);
                        }
                            console.log(req.user.friend[0].name);
                            res.render('group', {
                                friend : req.user.friend,
                                member: members,
                                bill: group.bills,
                                groupId: group_id,
                                settleOption: option,
                                css: ['dashboard.css', 'bootstrap.css', 'dashboardimage2.css']
                            });

                    }

                });

            }
        });

    });
    router.post('/group/settle/:id',ensureAuthenticated,function (req,res) {
        var group_id = req.params.id;

       Group.getGroupById(group_id,function(err,group){
            if(err){
                console.log(err);
                req.flash('error_msg', 'Something went wrong.Try again.');
                res.redirect('/');
            }
            else if(group===null){
                console.log('ERROR user not found');
                req.flash('error_msg', 'No such group');
                res.redirect('/');
            }
            else{
                var finish =0;
                var currBill=null;
                for(var i=0 ;i<group.bills.length;i++)
                    currBill = group.bills[i].toJSON();
                    finish += parseInt(currBill);
                    console.log("lenght " + currBill.partners.length);
                    for(var j=0;j<currBill.partners.length;j++){
                        console.log("bill " + i + " patrnership " + j+ " status " + currBill.partners[j].status);
                        console.log("user id "+ currBill.paid_By + " partnership " + currBill.partners[j]);
                        Group.settlePartnership(req,currBill.paid_By,currBill.partners[j],function (err,usr) {
                            finish-=1;
                        });

                    }
                }
                while(finish){}
                req.flash('success_msg', 'Transactions will be updated soon.');
                res.redirect('/');
        });
    });
    router.post('/group/addBill/:id',ensureAuthenticated,function (req,res) {
        var group_id = req.params.id;
        var part = req.body.myInputs;
        var amounts = req.body.myInputs1;
        var amount = req.body.amount;
        var note = req.body.note;
        console.log(group_id);

        console.log(part);
        console.log(amounts);
        console.log(amount);
        console.log(note);
        var sum =parseInt(amounts[0]);
        for(var m =1;m<part.length;m++){
            sum+=parseInt(amounts[m]);
        }
        console.log("sum" + sum);
        if(sum==amount){
            var  newBill = {
                name : req.user.first_name + " " + req.user.last_name,
                paid_By : req.user._id,
                amount : amount,
                note : note,
                partners: new Array()

            };
            for(var m =0;m<part.length;m++){
                    newBill.partners.push({
                        id : part[m],
                        amount : parseInt(amounts[m]),
                        status :"Unpaid"
                    });

            }

            Group.findOneAndUpdate({_id : group_id},{$addToSet:{bills : newBill}},function(err,group){
                if(err){
                    console.log(err);
                    req.flash('error_msg', 'Something went wrong.Try again.');
                    res.redirect('/users/group/'+ group_id);
                }
                else if(group===null){
                    console.log('ERROR user not found');
                    req.flash('error_msg', 'No such group');
                    res.redirect('/users/group/'+ group_id);
                }
                else{
                    req.flash('success_msg','Bill added');
                    res.redirect('/users/group/'+ group_id);




                }
            });
        }else{
            req.flash('error_msg','Sum dosn\'t match');
            res.redirect('/users/group/'+ group_id);
        }

    });


        router.post('/charge',function(req,res){
            var friend_email = req.body.friend_email;
            var SenderEmail = req.user.email;

            console.log(SenderEmail);
            console.log(friend_email);


 User.update(
                      { $and:[{"friend.email": friend_email },{"email": SenderEmail}]},
                      { "$set": { "friend.$.action": "You owe you friend" },
                        "$set":{"friend.$.amount" : "0"} },function(err){
                               console.log(SenderEmail);
                            console.log(friend_email);
                        });
                                                    


           stripe.customers.create({
           email : req.body.email,
           source : req.body.stripeToken
       })
       .then(customer => stripe.charges.create({
           amount : req.body.amount * 100,
           description : 'Friend debt' ,
           currency : 'usd' ,
           customer : customer.id
       }))
       .then(charge => {
        req.flash('success_msg', 'Payment Done Successfully');
        res.redirect('/')
    });
    });


    io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected : %s sockets connected',connections.length);

    //Disconnect
    socket.on('disconnect',function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected : %s sockets connected',connections.length);
    });
    
   socket.on('send message',function(data){
       
        io.emit('new message',{
            msg : data
        });
     });

    });
    return router;
};