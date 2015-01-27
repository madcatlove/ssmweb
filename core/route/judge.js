
var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    u = require('../Util');

var judgeController = require('../controller/judgeCont');

/* Judge Middleware */
router.use ( function(req, res, next) {
    console.log ('Start Judge');
    next();
});

router.use('/:jid([0-9]+)', function(req, res,next) {
    u.assert( req.params.jid > 0 , '잘못된 접근', 403);
    req.jid = parseInt( req.params.jid );
    next();
});

router.get('/:jid([0-9]+)', judgeController.procJudge);


module.exports = router;