
var express = require('express'),
    router = express.Router();

var u = require('../Util');

var freedrawController = require('../controller/freedrawCont');


/* Middleware */
router.use( function(req, res, next) {
    var sess = req.session;

    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);
    }

    next();
});

router.param('slotid', function(req, res, next, slotid) {
    var n = Number(slotid);
    if( isNaN(n) ) {
        throw u.error(u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode, true);
    }
    else if( !( n >= 1 && n <= 5) ) {
        throw u.error(u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode, true);
    }
    else {
        req.slotid = n;
        next();
    }
});


//------------------------
// ROUTING start with '/'
//------------------------

router.get('/view', freedrawController.view); // 뷰 렌더링 페이지
router.get('/view/:slotid([0-9]+)', freedrawController.viewBySlotid);

router.get('/slot', freedrawController.getAllSlotInfo); // 모든 슬롯의 정보를 가져옴.
router.get('/slot/:slotid([0-9]+)', freedrawController.getSlotInfoBySlotid); // 특정 슬롯 id 정보를 가져옴.
router.put('/slot/:slotid([0-9]+)', freedrawController.saveData); // 슬롯 저장 페이지



//--------------
// MODULE EXPORT
module.exports = router;
