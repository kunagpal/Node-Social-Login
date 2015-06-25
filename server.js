var morgan = require('morgan');
var app = require('express')();
var passport = require('passport');
var port = process.env.PORT || 8080;
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser("secret", {signed : true})); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
app.use('/', require('./app/routes.js')); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);