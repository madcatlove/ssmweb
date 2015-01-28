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

            boardDA.postArticle(article, resultCallback);
        }
        ,
}



/* EXPORT */
module.exports = service;