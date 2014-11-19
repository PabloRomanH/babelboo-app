var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongo = require('mongodb');
var db = require('monk')('localhost:27017/nodetest1');

function findByUserName(username, callback)
{
    var collection = db.get('usercollection');
    collection.find({username: username},{},function (err, result) {
        if (result.length == 0)
            return callback(null, null);
        else
            return callback(null, result[0]);
    });
}

function findById(id, callback)
{
    var collection = db.get('usercollection');
    collection.findById(id, function(err, user){
        if (user != null) {
            callback(null, user);
        } else {
            callback(new Error('User ' + id + ' does not exist'));
     }

    });
}

passport.serializeUser(function(user, done) {
        done(null, user._id);
        });

passport.deserializeUser(function(id, done) {
        findById(id, function (err, user) {
            done(err, user);
            });
        });

passport.use(new LocalStrategy(
    function(username, password, done) {
        findByUserName( username, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username. Try again.' });
            }
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password. Try again.' });
            }
            return done(null, user);
        });
    }
    ));

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // cookies need to be added before sessions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: '1234567890QWERTY', resave:true, saveUninitialized:true})); // TODO: learn about the session security requirements and change key
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

var server = app.listen(3000);
console.log('Express server started on port %s', server.address().port);

module.exports = app;

