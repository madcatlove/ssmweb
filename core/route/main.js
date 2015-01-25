
var express = require('express'),
    router = express.Router();


/* Middleware */
router.use( function(req, res, next) {
   next();
});

//------------------------
// ROUTING start with '/'
//------------------------

router.get('/', function(req, res) {
    console.log(req.session);
    var sess = req.session;
    sess.user_name = 'kr.madcat@gmail.com';
    sess.user_time = new Date();
    res.render('index')
});


router.get('/test', function(req, res) {
    console.info(' entering test ');

    res.render('test', {
        title : '제목이당'
    });
});



//--------------
// MODULE EXPORT
module.exports = router;
