
var express = require('express'),
    router = express.Router();

var freedrawController = require('../controller/freedrawCont');


/* Middleware */
router.use( function(req, res, next) {
    next();
});

//------------------------
// ROUTING start with '/'
//------------------------

router.get('/view', freedrawController.view);



//--------------
// MODULE EXPORT
module.exports = router;
