/**
 * 튜토리얼 관련 DataAccess
 * @type {db|exports}
 */
var db = require('../mysql');
var u  = require('../Util');
var fs = require('fs');
var path = require('path');
var async = require('async');

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

        var queryStatement  = ' SELECT TI.*, CI.title `chapterName` FROM  tutorialInfo TI, chapterInfo CI WHERE TI.seq = ?';
            queryStatement += ' AND TI.chapterSeq = CI.seq'


        db.getConnection( function(conn) {
            conn.query( queryStatement, [tid], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error (getTutorialInfo) ', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
        var queryStatement  = 'INSERT INTO tutorialResult (tutorialSeq, memberSeq, regdate) VALUES (?,?,NOW())';
            queryStatement += ' ON DUPLICATE KEY UPDATE regdate = NOW(); '; // 중복시 regdate 만 업데이트.

        db.getConnection( function(conn) {
            conn.query( queryStatement, [tid, member.seq], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error (markTutorialSuccess) ', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback(result);

                conn.release();
            })
        })
    },

    /**
     * 주어진 튜토리얼 아이디(tid) 보다 작은 result 의 갯수를 가져옴.
     * @param tid
     * @param resultCallback
     */
    getTutorialResultCount : function(tid, resultCallback) {

        var queryStatement = 'SELECT count(seq) `count` FROM tutorialResult WHERE tutorialSeq < ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [tid], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error ( getTutorialResultCount ) ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback( result );

                conn.release();
            })
        })

    },

    /**
     * 챕터별 튜토리얼 리스트 가져옴
     * @param resultCallback
     */
    getTutorialChapterList : function(resultCallback) {
        var queryStatement  = ' SELECT TI.title, TI.seq, CI.title `chapter` FROM tutorialInfo TI, chapterInfo CI ';
            queryStatement += ' WHERE TI.chapterSeq = CI.seq';
            queryStatement += ' ORDER BY CI.seq ASC, TI.problemSeq ASC';

        db.getConnection( function(conn) {
            conn.query( queryStatement, function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error ( getTutorialChapterList ) ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback(result);

                conn.release();
            })
        })
    },

    /**
     * 튜토리얼 컨텐츠 가져옴( 가이드, 연습내용, 이미지정보 )
     * @return { guide : ~~ , practice : ~~~ , image : ~~~ }
     * @param tid
     * @param resultCallback
     */
    getTutorialContent : function(tid, resultCallback) {
        var contentPath  = path.resolve( __dirname , '../../static/content');
            contentPath += '/' + tid;

        var cData = {
            guide : '',
            practice : '',
            image : [],
            glSolution : ''
        };

        fs.exists( contentPath, function(b) {
            if( !b ) {
                resultCallback( cData );
            }
            else {

                async.parallel([
                    /* 가이드 파일 읽어와서 추가 */
                    function getGuideFile( _callback) {
                        fs.readFile( contentPath + '/guide.html', 'UTF8', function(err, data) {
                            if( err ) {
                                _callback( err );
                            }
                            else {
                                cData.guide = data;
                                _callback(null);
                            }
                        })
                    },

                    /* 연습내용 파일 읽어와서 추가 */
                    function getPracticeFile( _callback) {
                        fs.readFile( contentPath + '/practice.html', 'UTF8', function(err, data) {
                            if( err ) {
                                _callback( err );
                            }
                            else {
                                cData.practice = data;
                                _callback(null);
                            }
                        })
                    },

                    /* 이미지 파일 읽어와서 추가 */
                    function getImageFile( _callback) {
                        fs.readdir( contentPath, function(err, filelist) {
                            var imglist = [];

                            for(var i = 0; i < filelist.length; i++) {
                                var sfile = filelist[i],
                                    sfile_ext = sfile.split('.');
                                sfile_ext = sfile_ext[ sfile_ext.length -1 ];

                                if ( /(png|gif|jpg|bmp)$/gi.test(sfile_ext) ) imglist.push( sfile );
                            }
                            cData.image = imglist;

                            _callback(null);
                        })
                    },

                    /* GL SourceCode 읽어와서 추가 */
                    function getGLSourceCode( _callback) {
                        fs.readFile( contentPath + '/glSolution.html', 'UTF8', function(err, data) {
                            if( err ) {
                                _callback( err );
                            }
                            else {
                                cData.glSolution = data;
                                _callback(null);
                            }
                        })
                    }

                ]
                ,
                    function finalExec(err, result) {
                        resultCallback( cData );
                    }

                );

            }
        });

    },

    /**
     * 튜토리얼별 진행상황 여부 가져옴.
     * @param member
     * @param resultCallback
     */
    getTutorialProgressInfo : function(member, resultCallback) {

        db.getConnection( function(conn) {
            var queryStatement  = ' SELECT TI.seq, TR.regdate FROM ';
                queryStatement += ' (SELECT * FROM tutorialInfo) TI ';
                queryStatement += ' LEFT OUTER JOIN';
                queryStatement += ' (SELECT * FROM tutorialResult WHERE memberSeq = ?) TR';
                queryStatement += ' ON';
                queryStatement += ' TI.seq = TR.tutorialSeq';

            conn.query( queryStatement, [member.seq], function(err, result) {
                if( err ) {
                    console.error(' tutorialDA Error ( getTutorialProgressInfo ) ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback(result);

                conn.release();
            })

        })

    }


}


/* EXPORT */
module.exports = dataAccess;