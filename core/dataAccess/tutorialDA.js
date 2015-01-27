/**
 * 튜토리얼 관련 DataAccess
 * @type {db|exports}
 */
var db = require('../mysql');
var u  = require('../Util');

/*
 TABLE NAME - tutorialInfo -
 seq	            int(11)	    NO	PRI		auto_increment
 title	            char(255)	NO
 guide_content	    text	    NO
 practice_content	text	    NO
 available_block	text	    NO
 extrainfo	        text	    NO
 chapterSeq	        int(11)	    YES
 problemSeq	        int(11)	    YES

 TABLE NAME - tutorialResult -
 seq	            int(11) 	NO	PRI		auto_increment
 tutorialSeq	    int(11) 	NO	MUL
 memberSeq	        int(11) 	NO	MUL
 regdate	        datetime	NO
 */


var dataAccess = {

    /**
     * 특정 TID(튜토리얼아이디) 의 튜토리얼 정보를 가져옴.
     * @param tid
     * @param resultCallback
     */
    getTutorialInfo : function(tid, resultCallback) {

        var queryStatement = 'SELECT * FROM  tutorialInfo WHERE seq = ?';


        db.getConnection( function(conn) {
            conn.query( queryStatement, [tid], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error (getTutorialInfo) ', err);
                    throw u.error( err.message, 500);
                }
                resultCallback( result );
                conn.release();
            })
        })

    },

    /**
     * 튜토리얼 리스트 정보를 모두 정렬하여 가져옴.
     * @param resultCallback
     */
    getTutorialList : function(resultCallback) {
        var queryStatement = 'SELECT * FROM tutorialInfo ORDER BY chapterSeq ASC, problemSeq ASC';

        db.getConnection( function(conn) {
            conn.query( queryStatement, function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error (getTutorialList) ', err);
                    throw u.error( err.message, 500);
                }

                resultCallback( result );
                conn.release();
            })
        })

    },

    /**
     * 특정회원 튜토리얼 성공 기록. ( insertID 를 리턴한다 )
     * @param member
     * @param tid
     * @param resultCallback
     * @callback last inserted id
     */
    markTutorialSuccess : function(member, tid, resultCallback) {
        var queryStatement = 'INSERT INTO tutorialResult (tutorialSeq, memberSeq, regdate) VALUES (?,?,NOW())';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [member.seq, tid], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error (markTutorialSuccess) ', err);
                    throw u.error( err.message, 500);
                }

                resultCallback( conn.insertId );
                conn.release();
            })
        })
    },

    getChapterCount : function(resultCallback) {
        var queryStatement = '';
        queryStatement += ' SELECT C.title AS `title`, count(*) `count`';
        queryStatement += ' FROM tutorialInfo T, chapterInfo C';
        queryStatement += ' WHERE T.chapterSeq = C.seq';
        queryStatement += ' GROUP BY T.chapterSeq';

        db.getConnection( function(conn) {
            conn.query( queryStatement , function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error ( getChapterCount ) ', err );
                    throw u.error( err.message, 500 );
                }

                resultCallback( result );
                conn.release();
            })
        })
    },


    getMemberChapterCount : function(member, resultCallback) {
        var queryStatement = '';

        queryStatement += ' SELECT CI.title `title`, count(MINFO.chapterSeq) `count` FROM';
        queryStatement += ' (SELECT TI.chapterSeq FROM tutorialResult T LEFT OUTER JOIN tutorialInfo TI ON T.tutorialSeq = TI.seq';
        queryStatement += ' WHERE T.memberSeq = ? ';
        queryStatement += ' ) MINFO,';
        queryStatement += ' chapterInfo CI';
        queryStatement += ' WHERE CI.seq = MINFO.chapterSeq';
        queryStatement += ' GROUP BY MINFO.chapterSeq';

        db.getConnection( function(conn) {
            conn.query(queryStatement, [member.seq], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error ( getMemberChapterCount ) ', err );
                    throw u.error( err.message, 500 );
                }
                resultCallback(result);

                conn.release();
            })
        })
    }



}


/* EXPORT */
module.exports = dataAccess;