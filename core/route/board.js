/**
 * 게시판 라우팅 파일
 * @type {*|exports}
 */

var express = require('express'),
    router = express.Router(),
    assert = require('assert');

var boardController = require('../controller/boardCont');

/* Middleware */
router.use( function(req, res, next) {

    next();
});

router.param('tid', function(req, res, next, tid) {
    req.tid = tid;
    next();
})

router.param('page', function(req, res, next, page) {
    req.page = page;
    next();
})

router.param('bid', function(req, res, next, bid) {
    req.bid = bid;
    next();
})


/* Routing */
router.get('/:tid([0-9]+)/:page?', boardController.getArticleList);
router.post('/:tid', boardController.postArticle);
router.delete('/:bid', boardController.removeArticle);
router.put('/:bid', boardController.modifyArticle);




/* EXPORT */
module.exports = router;