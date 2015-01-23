
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




//--------------
// MODULE EXPORT
module.exports = router;
