import mongoose from 'mongoose';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var bodyParser = require('body-parser');
var indexRouter = require('./routes');
var uploadRouter = require('./routes/uploader');
var posts = require('./routes/posts');
//var usersRouter = require('./routes/users');
//var moviesRouter = require('./routes/movies');

var app = express();

// db connect
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(
    'mongodb+srv://test:1234@moon-zpapa.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
    },
);
mongoose.Promise = global.Promise;

// view engine setup
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/post', posts);

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
