
var express = require('express'),
    router = express.Router(),
    u = require('../Util');

var judgeController = require('../controller/judgeCont');

/* Judge Middleware */
router.use ( function(req, res, next) {
    var sess = req.session;
    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode, true);
    }

    next();
});

router.use('/:jid([0-9]+)', function(req, res, next) {
    u.assert( req.params.jid > 0 , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
    u.assert( req.body.hasOwnProperty('data'), u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);

    req.jid = parseInt( req.params.jid );
    req.data = req.body.data;
    next();
});

router.post('/:jid([0-9]+)', judgeController.procJudge);


module.exports = router;