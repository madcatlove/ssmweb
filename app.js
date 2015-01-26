var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//----------------------------------------------
// Session part with Redis store
//----------------------------------------------
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redisConfig = require('./config/redisConfig');

//----------------------------------------------
var app = express();
var coreRoute = require('./core/route/route');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'static')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(cookieParser());


//---------------------------
// Session handler
//---------------------------
var redisSessionStore = new RedisStore({
   host : redisConfig.host,
   port : redisConfig.port,
   db   : redisConfig.db,
});

app.use( session({
    store : redisSessionStore,
    secret: '!@#$SECMEM!@#$',
    resave: false,
    saveUninitialized: true,
    //proxy: true,
    //cookie: { secure: true }
}));
app.use( redisConfig.errorHandler );


//---------------------------
// ROUTING ( 미들웨어 / 라우팅 )
//---------------------------
coreRoute(app);


//---------------------------
// 에러 핸들 미들웨어
//---------------------------
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.error('//----- Error Occur ----// ',  err );

        res.status(err.status || 500);

        /* 에러에 eType 가 있고 internal 값을 가지고있으면 JSON 으로 렌더링 */
        if( err.hasOwnProperty('eType') && err.eType == 'internal' ) {
            res.json( u.result(err.message, true) );
        }
        /* 아니라면 에러 view 페이지로 렌더링 */
        else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
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
