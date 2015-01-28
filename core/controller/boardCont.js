/**
 * 게시판 컨트롤러
 * @type {utility|exports}
 */

var u = require('../Util');
var boardService = require('../service/boardSvc'),
    tutorialService = require('../service/tutorialSvc');
var async = require('async');

var controller = {

    /**
     * 게시글 리스트 뷰 컨트롤러( Render )
     */
    getArticleListView : function(req, res) {
        var memberSession = req.session.member;
        var page = req.param('page') || 1;

        var opt = {
            member : memberSession,
            tid : req.tid,
            page : page,
            extraJS : ['member.js', 'board.js']
        };
        res.render('board_list', opt);

    },

    /**
     * 게시글 가져오는 컨트롤러
     * @param req
     * @param res
     */
    getArticleList : function(req, res) {
        var memberSession = req.session.member;
        if( !req.page ) req.page = 1;
        var page = parseInt(req.page);
        var countOffset = req.body.countOffset;

        var sParam = {
            tid : req.tid,
            page : page,
            countOffset : countOffset // 한페이지에 표시할 부모글 갯수.
        }

        boardService.getArticleList( sParam, function(result) {
            res.json(u.result( result));
        })
    },

    /**
     * 게시글 작성 컨트롤러
     * @param req
     * @param res
     */
    postArticle : function(req, res) {

        var memberSession = req.session.member;
        var content = req.body.content;
        var parentSeq = req.body.parentSeq;

        if( !parentSeq) parentSeq = -1;
        else parentSeq = parseInt(parentSeq);


        async.waterfall([
                /* tid 가 유효한지 확인 */
                function validTutorialSequence( _callback) {
                    tutorialService.getTutorialInfo(req.tid, function(result) {
                        if( !result ) {
                            throw u.error(' Invalid Tutorial ID ', 500);
                        }
                    })
                    _callback(null, true);
                },

                /* 게시글 작성 */
                function postArticle( o, _callback) {
                    var articleInfo =  {
                        memberSeq : memberSession.seq,
                        content : u.trim(content),
                        parentSeq : parentSeq,
                        tutorialSeq : req.tid
                    }

                    boardService.postArticle(articleInfo, function(insertId) {
                        if( insertId > 0 ) {
                            _callback( null, insertId );
                        } else {
                            throw u.error(' FAIL TO POST ARTICLE ');
                        }
                    })

                }

            ],
            function finalTask(err, result) {
                res.json(u.result(result) );
            }
        )
    },

    /**
     * 게시글 삭제 컨트롤러
     * @param req
     * @param res
     */
    removeArticle : function(req, res) {

    },

    /**
     * 게시글 수정 컨트롤러
     * @param req
     * @param res
     */
    modifyArticle : function(req, res) {

    },

}


/* EXPORT */
module.exports = controller;