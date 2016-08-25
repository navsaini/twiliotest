var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');

var accountSid = 'AC14207f44b28bf4ffc6aaef02d537c0a5';
var authToken = '2dd62c863ce11473ea609e481078034f';

var app = express();

var client = new twilio.RestClient(accountSid, authToken);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.post('/message', function(req, res) {
	request('http://catfacts-api.appspot.com/api/facts?number=100', function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		var json = JSON.parse(body);
	  		var text = json["facts"][Math.floor(Math.random() * 101)]
	  		console.log(text);
	  		res.send("<Response><Message>" + text + "</Message></Response>");
	  	} 
	});
});

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


module.exports = app;
