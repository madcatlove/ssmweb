var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('domain');
var u = require('./core/Util');



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
// 에러 도메인 처리
//---------------------------
app.use( require('express-domain-middleware') );
app.use(function(req, res, next) {
    var sdomain = domain.create();

    sdomain.add(req);
    sdomain.add(res);
    sdomain.run(function() {
        next();
    });
    sdomain.on('error', function(e) {
        next(e);
    });
});

//---------------------------
// 코어 라우팅 시작
//---------------------------
coreRoute(app);




module.exports = app;
