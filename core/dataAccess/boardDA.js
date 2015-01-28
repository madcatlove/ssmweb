/**
 * 튜토리얼별 질문 게시판 DataAccess
 */

/*
 - TABLE NAME : qnaBoard -
    seq	            int(11) 	NO	PRI		auto_increment
    tutorialSeq	    int(11)	    NO	MUL
    memberSeq	    int(11) 	NO	MUL
    content	        text	    NO
    parentSeq	    int(11)	    NO		-1
    regdate	        datetime	NO
*/

var db = require('../mysql');
var u  = require('../Util');

var dataAccess = {

    /* 게시판 글작성 */
    postArticle : function( article, resultCallback) {

        var queryStatement  = 'INSERT INTO qnaBoard (tutorialSeq, memberSeq, content, parentSeq, regdate ) VALUES ';
            queryStatement += '                    ( ?, ?, ?, ?, NOW() );';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [article.tutorialSeq, article.memberSeq, article.content, article.parentSeq], function( err, result) {

                if( err ) {
                    throw u.error( err.message, 500);
                }

                resultCallback( result.insertId);

                conn.release();
            })
        })

    },

    /* 댓글 부모번호 (주어진 articleId 로 업데이트함 ) 업데이트 */
    updateParentSeq : function( articleId, resultCallback) {

        var queryStatement = 'UPDATE qnaBoard SET parentSeq = ? WHERE seq = ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [articleId, articleId], function(err, result) {
                if( err ) {
                    throw u.error( err.message, 500);
                }
                resultCallback( result.affectedRows );
                conn.release();
            })
        })

    },

    /* 게시판 글 리스트 가져오기 */
    getArticleList : function( sParam, resultCallback) {

    }

}


/* EXPORT */
module.exports = dataAccess;