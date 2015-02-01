
var express = require('express'),
    router = express.Router(),
    u = require('../Util');

var judgeController = require('../controller/judgeCont');

/* Judge Middleware */
router.use ( function(req, res, next) {
    var sess = req.session;
    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(' 권한이 없습니다 ', 403, true);
    }

    next();
});

router.use('/:jid([0-9]+)', function(req, res, next) {
    u.assert( req.params.jid > 0 , '잘못된 접근', 403);
    u.assert( req.body.hasOwnProperty('data'), '잘못된 접근', 403);

    req.jid = parseInt( req.params.jid );
    req.data = req.body.data;
    next();
});

router.post('/:jid([0-9]+)', judgeController.procJudge);


module.exports = router;