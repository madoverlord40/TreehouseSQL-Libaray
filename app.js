//blows up here...
var sequelize = require("./models/index.js").sequelize;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* ERROR HANDLERS */

/* 404 handler to catch undefined or non-existent route requests */
app.use((req, res, next) => {

    console.log('404 error handler called');

    /* TODO 1: Send a response to the client
      - Set the response status to 404
      - Render the 'not-found' view
    */
    res.status(404).render('page-not-found');
});


/* Global error handler */
app.use((err, req, res, next) => {

    if (err) {
        console.log('Global error handler called', err);

        if (err.status === 404) {
            res.status(404).render('page-not-found', { err });
        } else {
            err.message = err.message || `Oops!  It looks like something went wrong on the server.`;
            res.status(err.status || 500).render('error', { err });
        }
    }
});

begin = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

begin();

module.exports = app;