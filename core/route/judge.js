
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
router.use('/judge/:jid([0-9]+)', function(req, res,next) {
    u.assert( req.params.jid > 0 , '잘못된 접근', 403);
    req.jid = parseInt( req.params.jid );
    next();
});

router.post('/judge/:jid([0-9]+)', judgeController.judge);


module.exports = router;