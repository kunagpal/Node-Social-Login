var db = require('./db.js');
var auth = require('./auth'); // use this one for testing
var passport = require('passport');
var User = require('../app/models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.fetch(id, done);
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        clientID        : auth.facebook.id,
        clientSecret    : auth.facebook.key,
        callbackURL     : auth.facebook.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user)
            {
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
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
                        var newUser            = new User();
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        newUser.save(function(err) {
                            if (err)
                            {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            }
            else
            {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                user.save(function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : auth.twitter.id,
        consumerSecret  : auth.twitter.key,
        callbackURL     : auth.twitter.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, tokenSecret, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user)
            {
                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
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
                        // if there is no user, create them
                        var newUser                 = new User();
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        newUser.save(function(err) {
                            if (err)
                            {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            }
            else
            {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session
                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;
                user.save(function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : auth.google.id,
        clientSecret    : auth.google.key,
        callbackURL     : auth.google.callback,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user)
            {
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
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
                        var newUser          = new User();
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                        newUser.save(function(err) {
                            if (err)
                            {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            }
            else
            {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session
                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                user.save(function(err) {
                    if (err)
                    {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        });
    }));