/**
 * Created by Lee on 2015-01-23.
 */

var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    util = require('../Util');

var tutorialController = require('../controller/tutorialCont');

/* Middleware */
router.use( function(req, res, next) {
    console.log( req.params );
    next();

});
router.use('/:tid([0-9]+)', function(req, res, next) {
    util.assert( req.params.tid > 0 , '잘못된 접근', 403);
    req.tid = parseInt( req.params.tid );
    next();
});


/* Routing */
router.get('/:tid([0-9]+)', tutorialController.procTutorial ); // 단계별 튜토리얼 진행






/* EXPORT */
module.exports = router;