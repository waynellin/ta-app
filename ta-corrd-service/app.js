let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let config = require('./config');
let index = require('./routes/index');
let course = require('./routes/course');
let assignments = require('./routes/assignments');
let posting = require('./routes/posting');
let offers = require('./routes/offers');

let app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
    next();
});

app.use('/', index);
app.use('/course', course);
app.use('/assignment', assignments);
app.use('/posting', posting);
app.use('/offers', offers);


/**
 * Connect to the DB.
 */

mongoose.connect(config.MONGO_URL + config.MONGO_CLUSTER_NAME);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('You got error: ' + err.status);
});

module.exports = app;
