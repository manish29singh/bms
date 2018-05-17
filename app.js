var express = require('express');
//dotenv config
require('dotenv').load();

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var https = require('https');
const fs = require('fs');
var helpers = require('./helpers/index');

mongoose.connect('mongodb://localhost/buldingmanager');
var db = mongoose.connection;

var routes = require('./routes/index');
var authRoute = require('./routes/authRoute');
var settingRoute = require('./routes/settingsRoute');
var userRoute = require('./routes/usersRoute');
var saRoute = require('./routes/saRoute');
var adminRoute = require('./routes/adminRoute');
var buildingRoute = require('./routes/buildingRoute');
var ticketRoute = require('./routes/ticketRoute');

//dotenv config
require('dotenv').load();
	
// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    isSuper: helpers.isSuper,
    isAdmin: helpers.isAdmin,
    isTenant: helpers.isTenant,
    serial: helpers.serial,
    changeColor: helpers.changeColor,
    disableReInvite: helpers.disableReInvite
  }
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



//route middlewares
app.use('/', routes);
app.use('/authentication', authRoute);
app.use('/setting', settingRoute);
app.use('/user', userRoute);
app.use('/sa', saRoute);
app.use('/admin', adminRoute);
app.use('/building', buildingRoute);
app.use('/tickets', ticketRoute);

// Server
var options = {
  key: fs.readFileSync('C:/auth/privateKey.key'),
  cert: fs.readFileSync('C:/auth/certificate.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

https.createServer(options, app).listen(process.env.PORT||3000);
