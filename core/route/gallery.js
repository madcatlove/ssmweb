
var express = require('express'),
    router = express.Router();

var u = require('../Util');
var galleryController = require('../controller/galleryCont');


/* Middleware */
router.use( function(req, res, next) {
    var sess = req.session;

    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(' 사용 권한이 없습니다. ', 403, true);
    }

    next();
});




//------------------------
// ROUTING start with '/'
//------------------------
router.get('/', galleryController.view); // 갤러리 리스트 뷰.
router.get('/info', galleryController.galleryList); // LIST JSON




//--------------
// MODULE EXPORT
module.exports = router;
