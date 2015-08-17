var passport = require('passport');
var router = require('express').Router();
require('../config/passport'); // pass passport for configuration

// normal routes ===============================================================
router.get('/', function(req, res){
    res.render('index', {mode : req.cookies.temp ? 0 : 1});
});

router.post('/', function(req, res){
    res.cookie('temp', req.body.team);
    res.redirect('/');
});

    // PROFILE SECTION =========================
    router.get('/profile', function(req, res) {
        if(req.signedCookies.name)
        {
            res.render('profile.ejs', {user : req.signedCookies.name});
        }
        else
        {
            res.redirect('/');
        }
    });

    // LOGOUT ==============================
    router.get('/logout', function(req, res) {
        res.clearCookie('name');
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
                successRedirect : '/social/callback',
                failureRedirect : '/'
            }));

    // twitter --------------------------------
        // send to twitter to do the authentication
        router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        router.get('/auth/twitter/callback', passport.authenticate('twitter', {
                successRedirect : '/social/callback',
                failureRedirect : '/'
            }));

    // google ---------------------------------
        // send to google to do the authentication
        router.get('/auth/google', passport.authenticate('google', { scope : [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
            ]
        }));

        // the callback after google has authenticated the user
        router.get('/auth/google/callback', passport.authenticate('google', {
                successRedirect : '/social/callback',
                failureRedirect : '/'
            }));

        router.get('/social/callback', function(req, res){
            if(req.user)
            {
                res.cookie('name', req.user._id, {maxAge : 86400000, signed : true});
                res.clearCookie('temp');
                delete req.user;
                res.redirect('/profile');
            }
        });

module.exports = router;