/**
 * 게시판 라우팅 파일
 * @type {*|exports}
 */

var express = require('express'),
    router = express.Router(),
    u = require('../Util');

var boardController = require('../controller/boardCont');

/* Middleware */
router.use( function(req, res, next) {
    next();
});

router.use( function(req, res, next) {
    var sess = req.session;
    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);
    }

    next();
})

/* 튜토리얼 아이디 주입 */
router.param('tid', function(req, res, next, tid) {
    req.tid = parseInt(tid);
    next();
})

/* 게시판 리스트 페이지 번호 주입 */
router.param('page', function(req, res, next, page) {
    req.page = parseInt(page);
    next();
})

/* 게시판 글 고유번호(DB상) 번호 */
router.param('bid', function(req, res, next, bid) {
    req.bid = parseInt(bid);
    next();
})


/* Routing */
router.get('/:tid([0-9]+)/info', boardController.getBoardInfo); /* 게시판 정보 컨트롤러 */
router.get('/:tid([0-9]+)/view', boardController.getArticleListView); /* 게시판 리스트 뷰 컨트롤러 */
router.get('/:tid([0-9]+)/:page?', boardController.getArticleList); /* 게시판 리스트 컨트롤러 */
router.post('/:tid', boardController.postArticle); /* 게시판 글 작성 컨트롤러 */
router.delete('/:bid', boardController.removeArticle); /* 게시판 글 삭제 컨트롤러 */
router.put('/:bid', boardController.modifyArticle); /* 게시판 글 수정 컨트롤러 */




/* EXPORT */
module.exports = router;