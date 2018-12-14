var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
const alexa = require('./routes/alexa');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
alexa.express({
  expressApp: app,
  endpoint: '/alexa',
  checkCert: true
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  //console.log(req.originalUrl)
  res.sendFile(path.join(__dirname,'..', 'build','index.html'));
});
app.get('/static/*', function(req, res) {
  //console.log(req.originalUrl)
  res.sendFile(path.join(__dirname,'..', 'build',req.originalUrl));
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendStatus(404)
  //res.json(404,{})
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
