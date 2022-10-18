var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var updateUserSettings = require("./routes/updateUserSettings");
var updateCustomTheme = require("./routes/updateCustomTheme");
var updateMetaData = require("./routes/updateMetaData");

var deleteTheme = require("./routes/deleteTheme");
var getUserThemes = require("./routes/getUserThemes");
var getDefaultThemes = require("./routes/getDefaultThemes");
var getMetaData = require("./routes/getMetaData");
var getGameResults = require("./routes/getGameResults");

var getUser = require("./routes/getUser");
var insertUser = require("./routes/insertUser");
var insertCustomTheme = require("./routes/insertCustomTheme");
var insertGameResults = require("./routes/insertGameResults");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/updateUserSettings", updateUserSettings);
app.use("/updateCustomTheme", updateCustomTheme);
app.use("/updateMetaData", updateMetaData);

app.use("/getUserThemes", getUserThemes);
app.use("/getDefaultThemes", getDefaultThemes);
app.use("/getMetaData", getMetaData);
app.use("/getGameResults", getGameResults);

app.use("/deleteTheme", deleteTheme);

app.use("/getUser", getUser);
app.use("/insertUser", insertUser);
app.use("/insertCustomTheme", insertCustomTheme);
app.use("/insertGameResults", insertGameResults);


require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

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
