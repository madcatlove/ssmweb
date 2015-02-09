/**
 * 튜토리얼 관련 정보를 다루는 서비스
 * @type {utility|exports}
 */
var u = require('../Util'),
    async = require('async');
var tutorialDA = require('../dataAccess/tutorialDA');

var service = {

    /**
     * 특정 TID(튜토리얼아이디) 의 튜토리얼 정보를 가져옴.
     * @param tid
     * @param resultCallback
     */
    getTutorialInfo : function(tid, resultCallback) {
        if(!tid) {
            throw u.error(u.ETYPE.FORBID.message + ' : 튜토리얼 아이디 누락 ', u.ETYPE.FORBID.errorCode);
        }
        tid = parseInt( tid );

        async.waterfall([

            //-----------------------------
            // 튜토리얼 기본정보 가져옴
            //-----------------------------
            function get_tutorialInfo( _callback) {
                tutorialDA.getTutorialInfo(tid, function(result) {

                    var data = result[0];
                    if( typeof data != 'undefined'  ) {
                        var blockStr = data.available_block.split(',');
                        data.available_block = blockStr;

                        if( data.js_filename != null ) {
                            var jsfile = data.js_filename.split(',');
                            data.js_filename = jsfile;
                        }
                        else {
                            data.js_filename = [];
                        }

                    }
                    _callback( null, data );
                });
            },

            //-----------------------------
            // 튜토리얼 가이드 정보 가져옴.
            //-----------------------------
            function get_tutorialExtracontent( data, _callback) {
                tutorialDA.getTutorialContent(tid, function( contentResult ) {
                    data.guide_content = contentResult.guide;
                    data.practice_content = contentResult.practice;
                    data.image_content = contentResult.image;
                    data.glSolution = contentResult.glSolution;

                    _callback( null, data );
                })
            },

        ],

            //-----------------------------
            // 최종콜백
            //-----------------------------
            function finalExec( err, result) {
                resultCallback(result);
            }
        );

    },

    /**
     * 튜토리얼 리스트 정보를 모두 정렬하여 가져옴.
     * @param resultCallback
     */
    getTutorialList : function(resultCallback) {
        tutorialDA.getTutorialList(resultCallback);
    },

    /**
     * 특정회원 튜토리얼 성공 기록. ( insertID 를 리턴한다 )
     * @param memberSession
     * @param tid
     * @param resultCallback
     */
    markTutorialSuccess : function(memberSession, tid, resultCallback) {
        u.assert( tid , u.ETYPE.FORBID.message + ' : 튜토리얼 아이디 누락 ', u.ETYPE.FORBID.errorCode);
        u.assert( memberSession, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode );
        u.assert( memberSession.seq, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode );

        tutorialDA.markTutorialSuccess( memberSession, tid, function(result) {
            if( result > 0 ) {
                resultCallback( true );
            }
            else {
                resultCallback( false );
            }
        })
    },

    /**
     * 현재 튜토리얼이 진행가능한 상태인지 확인. (true, false 리턴)
     * @param tid
     * @param resultCallback
     */
    isValidStep : function(tid, resultCallback) {

        async.waterfall([

            // 현재 튜토리얼이 있는지?
            function availableTutorial( _callback) {
                tutorialDA.getTutorialInfo(tid, function(result) {
                    if( result ) {
                        _callback(null, true );
                    }
                    else {
                        _callback(null, false);
                    }
                })
            },

            // 이전 튜토리얼이 클리어 되어있는지?
            function completePrevTutorials( b, _callback) {
                if( !b ) {
                    _callback(null, false);
                }
                else {
                    tutorialDA.getTutorialResultCount(tid, function (result) {
                        var fCount = result[0].count;

                        // 현재 tutorial id -1 == 완료된 갯수.

                        if (fCount == tid - 1) {
                            _callback(null, true);
                        }
                        else {
                            _callback(null, false);
                        }
                    })
                }
            }

        ],
            // 최종 실행 콜백.
            function finalExec( err, result ) {
                resultCallback( result );
            }
        )

    },

    /**
     * 챕터별 튜토리얼 리스트 가져옴 (2D, 3D, 3D+)
     * @param resultCallback
     * @return { items }
     */
    getTutorialChapterList : function(resultCallback) {

        var items = {};

        tutorialDA.getTutorialChapterList( function(result) {
            for(var i = 0; i < result.length; i++) {
                var item = result[i];

                if( !items.hasOwnProperty( item.chapter ) ) {
                    items[ item.chapter ] = [];
                }
                items[ item.chapter].push( item );
            }

            resultCallback( items );
        })

    },

    /**
     * 튜토리얼 단계별 진행 여부 데이터 가공 서비스
     * @param member
     * @param resultCallback
     */
    getTutorialProgressInfo : function(member, resultCallback) {
        u.assert( member, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode );
        u.assert( member.seq, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode );

        var progressList = {};

        async.waterfall( [
            function getTutorialList( _callback) {
                tutorialDA.getTutorialList( function(result) {
                    for(var i = 0; i < result.length; i++) {
                        progressList[ result[i].seq ] = false;
                    }

                    _callback(null);
                })
            },


            function getTutorialProgress( _callback) {

                tutorialDA.getTutorialProgressInfo( member, function(result) {
                    for(var i = 0; i < result.length; i++) {

                        // 고유번호가있고 체크되어있다면 트루로.
                        if( progressList.hasOwnProperty( result[i].seq ) && result[i].regdate ) {
                            progressList[ result[i].seq ] = true;
                        }
                    }
                    _callback(null);
                } );
            }
        ],

            /* 최종콜백 */
            function finalExec( err, result) {
                resultCallback( progressList );
            }

        );

    }




}


/* EXPORT */
module.exports = service;