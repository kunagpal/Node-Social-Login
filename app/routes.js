var passport = require('passport');
var router = require('express').Router();
require('../config/passport'); // pass passport for configuration

// normal routes ===============================================================

    // show the home page (will also have our login links)
    router.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    router.get('/profile', function(req, res) {
        if(req.isAuthenticated())
        {
            res.render('profile.ejs', {user : req.user});
        }
        else
        {
            res.redirect('/');
        }
    });

    // LOGOUT ==============================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // facebook -------------------------------
        // send to facebook to do the authentication
        router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        router.get('/auth/facebook/callback', passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------
        // send to twitter to do the authentication
        router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        router.get('/auth/twitter/callback', passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------
        // send to google to do the authentication
        router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/auth/google/callback', passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

module.exports = router;