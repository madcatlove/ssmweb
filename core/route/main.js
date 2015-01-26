
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
    var sess = req.session;

    console.log(sess);

    var opt = {
        extraJS : ['member.js'],
        member : sess.member
    }

    res.render('index', opt);

});



//--------------
// MODULE EXPORT
module.exports = router;
