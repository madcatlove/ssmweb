/**
 * Created by Lee on 2015-01-28.
 */
var u = require('../Util');
var boardDA = require('../dataAccess/boardDA');
var crypto = require('crypto');


var service = {

        /* 게시판 글 리스트 가져오기 */
        getArticleList : function( sParam, resultCallback) {
            u.assert( sParam.tid > 0 );
            u.assert( sParam.page > 0 );
            if( !sParam.countOffset ) sParam.countOffset = 10;

            // 시작점
            var startOffset = (sParam.page -1) * sParam.countOffset;
            sParam.startOffset = startOffset;

            boardDA.getArticleList( sParam, function(result) {
                //-- DA 에서 받아온 데이터 콜백으로 넘김
                //-- 나중에 뭔가 처리를 위해서..
                resultCallback( result );
            })
        },



        /* 게시판 글 작성 */
        postArticle : function( article, resultCallback) {
            u.assert(article.memberSeq);
            u.assert(article.content && article.content.length > 0);

            boardDA.postArticle(article, function(insertId) {

                if( article.parentSeq == -1 ) {
                    boardDA.updateParentSeq( insertId, function( affectRow ) {
                        resultCallback( insertId );
                    })
                }
                else {
                    resultCallback( insertId );
                }

            });
        },

        /* 게시판 부모글이 몇개인지 조회 */
        getParentArticleCount : function( tid, resultCallback) {
            u.assert( tid );
            boardDA.getParentArticleCount(tid, function(result) {
                resultCallback( parseInt(result[0].count) );
            });
        },


}



/* EXPORT */
module.exports = service;