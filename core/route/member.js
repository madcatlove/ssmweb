/**
 * Created by Lee on 2015-01-23.
 */

var express = require('express'),
    router = express.Router(),
    assert = require('assert');

var memberController = require('../controller/memberCont');

/* Middleware */
router.use( function(req, res, next) {
    console.log( req.params );
    next();

});



/* Routing */
router.post('/login', memberController.procLogin); // 로그인 처리.

router.get('/join', memberController.renderJoin);
router.post('/join', memberController.procJoin);






/* EXPORT */
module.exports = router;