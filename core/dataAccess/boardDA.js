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
                    console.error(' boardDA Error (postArticle)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
                    console.error(' boardDA Error (updateParentSeq)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback( result.affectedRows );
                conn.release();
            })
        })

    },

    /* 게시판 글 리스트 가져오기 */
    getArticleList : function( sParam, resultCallback) {

        var limitIdentifier = ''+ parseInt(sParam.startOffset) + ',' + parseInt(sParam.countOffset);

        var queryStatement = '';
            queryStatement += " SELECT B.*, CONVERT_TZ(B.regdate, '+00:00', '+09:00') `cregdate`, MEMBER.userid FROM";
            queryStatement += ' (';
            //-- 부모글만 가져오는 쿼리
            queryStatement += ' (SELECT * FROM qnaBoard WHERE tutorialSeq = ? AND seq = parentSeq ORDER BY seq DESC LIMIT '+limitIdentifier+')'
            queryStatement += ' UNION';

            //-- 대댓글 붙이기
            queryStatement += ' (';
            queryStatement += '   SELECT QB1.* FROM qnaBoard QB1,';
            queryStatement += '  (SELECT * FROM qnaBoard WHERE tutorialSeq = ? AND seq = parentSeq ORDER BY seq DESC LIMIT '+limitIdentifier+' ) QB2';
            queryStatement += '  WHERE';
            queryStatement += '   QB1.tutorialSeq = ? AND QB1.seq != QB1.parentSeq AND';
            queryStatement += '   QB1.parentSeq = QB2.seq';
            queryStatement += ' )';
            queryStatement += ' ) B, memberInfo MEMBER';
            queryStatement += ' WHERE MEMBER.seq = B.memberSeq ORDER BY B.parentSeq DESC , B.regdate ASC';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [sParam.tid, sParam.tid, sParam.tid], function(err, result) {
                if( err ) {
                    console.error(' boardDA Error (getArticleList)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback( result );
                conn.release();
            })

        })
    },


    /* 부모글이 몇개인지 가져옴 */
    getParentArticleCount : function(tid, resultCallback) {
        var queryStatement = 'SELECT count(seq) AS `count` FROM qnaBoard WHERE tutorialSeq = ? AND seq = parentSeq';

        db.getConnection( function(conn) {

            conn.query( queryStatement, [tid], function(err, result) {

                if( err ) {
                    console.error(' boardDA Error (getParentArticleCount)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback( result );

                conn.release();
            })

        })
    },

    /**
     * 시퀀스 번호를 통해 게시글을 가져옴.
     * @param bid
     * @param resultCallback
     */
    getArticleBySeq : function(bid, resultCallback) {

        var queryStatement = "SELECT *, CONVERT_TZ(regdate, '+00:00', '+09:00') `cregdate` FROM qnaBoard WHERE seq = ?";

        db.getConnection( function(conn) {
            conn.query( queryStatement, [bid], function(err, result) {
                if( err ) {
                    console.error(' boardDA Error (getArticleBySeq)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback( result );

                conn.release();
            })
        })

    },

    /**
     * 주어진 시퀀스 번호에 해당하는 게시글 삭제
     * @param bid
     * @param resultCallback
     */
    removeArticleBySeq : function(bid, resultCallback) {
        var queryStatement = 'DELETE FROM qnaBoard WHERE seq = ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [bid], function(err, result) {
                if(err) {
                    console.error(' boardDA Error (removeArticleBySeq)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback(true);
                conn.release();
            })
        })

    },

    /**
     * 시퀀스 번호에 해당하는 부모글 , 그 부모글을 가지는 차일드 글 모두 삭제 ( 부모글 + 자식글 모두 삭제 )
     * @param bid
     * @param resultCallback
     */
    removeArticleParentAndChild : function(bid, resultCallback) {
        var queryStatement = 'DELETE FROM qnaBoard WHERE seq = ? OR parentSeq = ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [bid, bid], function(err, result) {
                if(err) {
                    console.error(' boardDA Error (removeArticleParentAndChild)', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback(true);

                conn.release();
            })
        })

    }

}


/* EXPORT */
module.exports = dataAccess;