var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');

var indexRouter = require('./routes/indexRouter');
var calcRouter = require('./routes/calcRouter');
var portRouter = require('./routes/portfolioBuilderRouter');
var registerRouter = require('./routes/registerRouter');
var loginRouter = require('./routes/loginRouter');
var logoutRouter = require('./routes/logoutRouter');

var app = express();

// production environment session setup
var session = require('express-session');
var MemoryStore = require('memorystore')(session); // module to avoid memory leaks

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// more configs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use this setup + above ('production environment session setup') for production sessions
app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired every 24 hours
    }),
    secret: process.env.sessionSecret, // from .env -- changed for security
    saveUninitialized: true,
    resave: true
}));
  
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Global Vars -- order matters! Up too high, and locals.user is not set
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// tier one routing
app.use('/', indexRouter);
app.use('/calculator', calcRouter);
app.use('/profile', portRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
