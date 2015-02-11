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
        var page = req.query.page || 1;

        var opt = {
            member : memberSession,
            tid : req.tid,
            page : page,
            extraJS : ['board.js'],
            tutorialChapterList : null,
            tutorialTitle : ''
        };

        async.waterfall([
            /* 튜토리얼 챕터별 리스트 생성 */
            function makeChapterList( _callback) {
                tutorialService.getTutorialChapterList( function(result) {
                    opt.tutorialChapterList = result;
                    _callback( null );
                })
            },

            /* 튜토리얼 제목 가져옴 */
            function tutorialTitle( _callback) {
                tutorialService.getTutorialInfo(req.tid, function(result) {
                    if( result && result.hasOwnProperty('chapterName') && result.hasOwnProperty('title') ) {
                        opt.tutorialTitle = result.chapterName + ' - ' + result.title;
                    }
                    else {
                        throw u.error(u.ETYPE.FORBID.message , u.ETYPE.FORBID.errorCode, true);
                    }
                    _callback( null );
                })
            }
        ],
            /* 최종 실행 콜백 */
            function finalExec( err, result) {
                res.render('board_list', opt);
            }
        );

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
        var countOffset = req.query.countOffset;


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
                            throw u.error(u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
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
                            throw u.error(u.ETYPE.CRITICAL.message, u.ETYPE.CRITICAL.errorCode);
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
     * 튜토리얼별 질문게시판 정보 가져오는 컨트롤러
     * @param req
     * @param res
     */
    getBoardInfo : function(req, res) {
        var boardInfo = {};
        var tid = req.tid;

        async.waterfall([
            /* tid 가 유효한지 확인 */
            function validTutorialSequence( _callback) {
                tutorialService.getTutorialInfo(req.tid, function(result) {
                    if( !result ) {
                        throw u.error(u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
                    }
                    _callback(null, true);
                })
            },

            /* 부모글 갯수 삽입 */
            function injectParentArticleCount(o, _callback) {
                boardService.getParentArticleCount( tid, function(result) {
                    boardInfo.parentCount = result;
                    _callback( null, true );
                })
            }


        ],

            /* 최종 Task */
            function finalTask(err, result) {
                res.json(u.result( boardInfo ) );
            }

        );

    },


    /**
     * 게시글 삭제 컨트롤러
     * @param req
     * @param res
     */
    removeArticle : function(req, res) {
        var sess = req.session;
        var bid = req.bid;

        u.assert( sess.member, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( bid, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);

        boardService.removeArticle(bid, sess.member, function(result) {
            res.json( u.result(result) );
        })

    },

    /**
     * 게시글 수정 컨트롤러
     * @param req
     * @param res
     */
    modifyArticle : function(req, res) {
        /* 폐기 */
    },

}


/* EXPORT */
module.exports = controller;