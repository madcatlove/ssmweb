/**
 * 게시판 컨트롤러
 * @type {utility|exports}
 */

var u = require('../Util');
var boardService = require('../service/boardSvc'),
    tutorialService = require('../service/tutorialSvc');
var async = require('async');

var controller = {

    getArticleList : function(req, res) {
        var memberSession = req.session.member;
        if( !req.page ) req.page = 1;
        var page = parseInt(req.page);
        var countOffset = req.body.countOffset;

        var sParam = {
            tid : req.tid,
            page : page
        }

        boardService.getArticleList( sParam, function(result) {

        })
    },

    postArticle : function(req, res) {

        var memberSession = req.session.member;
        var content = req.body.content;
        var parentSeq = req.body.parentSeq;


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
                    if( !parentSeq) parentSeq = -1;
                    else parentSeq = parseInt(parentSeq);

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

    removeArticle : function(req, res) {

    },

    modifyArticle : function(req, res) {

    },

}


/* EXPORT */
module.exports = controller;