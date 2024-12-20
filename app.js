var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
require('./models/user-models');
require('./models/product-models');
require('./models/student-models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/product');
var studentsRouter = require('./routes/student');
var uploadRouter = require('./routes/upload');
var mailRouter = require('./routes/mail');
var movieRouter = require('./routes/movie');

var app = express();

mongoose.connect('mongodb+srv://nguyenquocanh289:jvquiiV7J13yUS3Q@cluster0.bbfum.mongodb.net/Whatever').then(() => console.log("Database connected"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/hello', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/students', studentsRouter);
app.use('/upload', uploadRouter);
app.use('/mail', mailRouter);
app.use('/movie', movieRouter);

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
