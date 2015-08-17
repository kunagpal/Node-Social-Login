var db = require('./db.js');
var auth = require('./auth'); // use this one for testing
var passport = require('passport');
var twitter = require('passport-twitter').Strategy;
var facebook = require('passport-facebook').Strategy;
var google = require('passport-google-oauth').OAuth2Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.fetch(id, done);
    });

    passport.use(new facebook({
        clientID        : auth.facebook.id,
        clientSecret    : auth.facebook.key,
        callbackURL     : auth.facebook.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.signedCookies.name)
            {
                console.log(req.cookies.temp);
                db.find({ '_id' : req.cookies.temp }, function(err, user) {
                    if (err)
                    {
                        return done(err);
                    }
                    if (user)
                    {
                          return done(null, user); // user found, return that user
                    }
                    else // if there is no user, create them
                    {
                        var onGetCount = function(err, number){
                            if(err)
                            {
                                console.log(err.message);
                            }
                            else
                            {
                                var newUser = {};
                                newUser._id = req.cookies.temp;
                                newUser.num = parseInt(number) + 1;
                                newUser.token = token;
                                newUser.profile = profile.id;
                                newUser.strategy = 'facebook';
                                newUser.email = (profile.emails[0].value || '').toLowerCase();
                                newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                                db.save(newUser, function(err, newUser) {
                                    if (err)
                                    {
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        };
                        db.count(onGetCount);
                    }
                });
            }
            else
            {
                var user = req.user; // pull the user out of the session
                user._id = req.cookies.temp;
                user.token = token;
                user.profile = profile.id;
                user.email = (profile.emails[0].value || '').toLowerCase();
                user.name = profile.name.givenName + ' ' + profile.name.familyName;
                db.save(user, function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));

    passport.use(new twitter({
        consumerKey     : auth.twitter.id,
        consumerSecret  : auth.twitter.key,
        callbackURL     : auth.twitter.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, tokenSecret, profile, done) {
        process.nextTick(function() {
            if (!req.signedCookies.name)
            {
                db.find({ '_id' : req.cookies.temp}, function(err, user) {
                    if (err)
                    {
                        return done(err);
                    }
                    if (user)
                    {
                        return done(null, user); // user found, return that user
                    }
                    else
                    {
                        var onGetCount = function(err, number){
                            if(err)
                            {
                                console.log(err.message);
                            }
                            else
                            {
                                var newUser = {};
                                newUser._id = req.cookies.temp;
                                newUser.num = parseInt(number) + 1;
                                newUser.token = token;
                                newUser.strategy = 'twitter';
                                newUser.profile = profile.id;
                                newUser.name = profile.displayName;
                                db.save(newUser, function(err) {
                                    if (err)
                                    {
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        };
                        db.count(onGetCount);
                    }
                });
            }
            else
            {
                var user = req.user; // pull the user out of the session
                user._id = req.cookies.temp;
                user.token = token;
                user.profile = profile.id;
                user.name = profile.displayName;
                db.save(user, function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));

    passport.use(new google({
        clientID        : auth.google.id,
        clientSecret    : auth.google.key,
        callbackURL     : auth.google.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (!req.signedCookies.name)
            {
                db.find({ '_id' : req.cookies.temp}, function(err, user) {
                    if (err)
                    {
                        return done(err);
                    }
                    if (user)
                    {
                           return done(null, user);
                    }
                    else
                    {
                        var onGetCount = function(err, number){
                            if(err)
                            {
                                console.log(err.message);
                            }
                            else
                            {
                                var newUser = {};
                                newUser._id = req.cookies.temp;
                                newUser.num = parseInt(number) + 1;
                                newUser.token = token;
                                newUser.strategy = 'google';
                                newUser.profile = profile.id;
                                newUser.name = profile.displayName;
                                newUser.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                                db.save(newUser, function(err) {
                                    if (err)
                                    {
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        };
                        db.count(onGetCount);
                    }
                });
            }
            else
            {
                var user = req.user; // pull the user out of the session
                user._id = req.cookies.temp;
                user.token = token;
                user.profile = profile.id;
                user.name = profile.displayName;
                user.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                db.save(user, function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));