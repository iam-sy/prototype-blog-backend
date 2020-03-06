import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';

require('dotenv').config({ path: path.join(__dirname, '.env') });

import { mongooseConnect } from './db/mongoose/connect';

import { homeRouter } from './routes/index';
import { uploadRouter } from './routes/uploader';
import { postRouter } from './routes/posts';
import { authRouter } from './routes/auth';

var app = express();

// db connect
mongooseConnect();

// view engine setup
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(
    bodyParser.json({
        limit: '20mb',
        extended: true,
    }),
);

/* router */
app.use('/', homeRouter);
app.use('/api', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/post', postRouter);

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
