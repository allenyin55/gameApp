var LocalStrategy = require('passport-local').Strategy;

var User            = require('../app/models/user');

var configAuth = require('./auth');

var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {


    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done){
            process.nextTick(function(){
                User.findOne({'local.username': email}, function(err, user){
                    if(err)
                        return done(err);
                    if(user){
                        return done(null, false, req.flash('signupMessage', 'That email already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.username = email;
                        newUser.local.password = password;

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
                })

            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done){
            process.nextTick(function(){
                User.findOne({ 'local.username': email}, function(err, user){
                    if(err)
                        return done(err);
                    if(!user)
                        return done(null, false, req.flash('loginMessage', 'No User found'));
                    if(user.local.password != password){
                        return done(null, false, req.flash('loginMessage', 'inavalid password'));
                    }
                    return done(null, user);

                });
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebook.clientID,
            clientSecret: configAuth.facebook.clientSecret,
            callbackURL: configAuth.facebook.clientURL
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if(err)
                        return done(err);
                    if(user)
                        return done(null, user)
                    else{
                        var newUser  = new User;
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name= profile.name.givenName + ' '+ profile.name.familyName;

                        newUser.save(function (err) {
                            if(err)
                                return err;
                            return done(null, newUser);
                        })
                    }
                })
            })
        }
    ));


};