/**
 * Created by Lee on 2015-01-28.
 */
var u = require('../Util');
var boardDA = require('../dataAccess/boardDA');
var crypto = require('crypto');


var service = {
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
        }
        ,

        /* 게시판 글 리스트 가져오기 */
        getArticleList : function( sParam, resultCallback) {
            u.assert( sParam.tid > 0 );
            u.assert( sParam.page > 0 );

        }
}



/* EXPORT */
module.exports = service;