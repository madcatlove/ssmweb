/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var tutorialService = require('../service/tutorialSvc');
var async = require('async');

var controller = {

    /* 튜토리얼 진행 컨트롤러 */
    procTutorial : function(req, res) {
        var sess = req.session;

        var opt = {
            extraJS : [
                'member.js',
                'sblock/moveblock.js', 'threejs/three.js', 'threejs/OrbitControls.js',
                'gl/sgl.js', 'tutorial.js',
                'sblock/sblock.js',
                'syntax/shCore.js', 'syntax/shAutoloader.js', 'syntax/shBrushCpp.js', 'metro.min.js'],
            extraCSS : ['blocks.css',
                        'shCore.css', 'shThemeDefault.css', 'metro-bootstrap.min.css'],
            member : sess.member,
            tid : req.tid
        }


        async.waterfall(
            [

                /* 튜토리얼 기본정보 */
                function getTutorialInfo( _callback) {
                    tutorialService.getTutorialInfo( req.tid, function(result) {
                        var jsfile = result.js_filename;
                        for( var js in jsfile ) opt.extraJS.push( '/gl/' + result.js_filename[js] );

                        _callback(null);
                    })
                },

                /* 튜토리얼 진행이 가능한지? */
                /*function validTutorialStep( _callback) {
                    tutorialService.isValidStep( req.tid, function(result) {
                        if( result ) {
                            _callback( null );
                        }
                        else {
                            throw u.error(' 현재 단계에 접근할수 없습니다. ', 403, 'external');
                        }
                    })
                },*/

                /* 튜토리얼 챕터별 리스트 생성 */
                function makeChapterList( _callback) {
                    tutorialService.getTutorialChapterList( function(result) {
                        opt.tutorialChapterList = result;
                        _callback( null );
                    })
                },

                /* 튜토리얼 진행상황 리스트 생성 */
                function makeProgressList( _callback) {
                    tutorialService.getTutorialProgressInfo( sess.member, function(result) {
                        opt.tutorialProgressList = result;
                        _callback( null );
                    })
                },

                /* 다음 튜토리얼 스텝 정보 추가 */
                function nextTutorialId( _callback ) {
                    var nextTid = req.tid + 1;

                    // 마지막 스텝이라면 nextTid 교체
                    if( nextTid == opt.tutorialChapterList.length ) {
                        nextTid = 255;
                    }

                    opt.nextTid = nextTid;

                    _callback( null );
                }

            ],

                /* 최종 실행 콜백 */
                function finalExec( err, result) {
                    res.render('tutorial', opt);
                }

        );

    },

    /* 튜토리얼 정보를 가져오는 컨트롤러 */
    getTutorialInfo : function(req, res) {
        var sess = req.session;

        tutorialService.getTutorialInfo( req.tid, function(result) {
            if( typeof result === 'undefined' ) {
                res.json(u.result(' 잘못된 접근 ', true) );
            }
            else {
                res.json(u.result( result, false) );
            }


        })

    },

    /**
     * 챕터별 진행상황 가공 컨트롤러
     * @param req
     * @param res
     */
    getTutorialChapterProgressInfo : function(req, res) {
        var sess = req.session;

        var chapterList = {};
        var progressList = {};

        async.waterfall([
            function makeChapterList( _callback) {
                tutorialService.getTutorialChapterList( function(result) {
                    chapterList = result;

                    _callback( null );
                })
            },

            function makeProgressList( _callback) {
                tutorialService.getTutorialProgressInfo( sess.member, function(result) {
                    progressList = result;

                    _callback( null );
                })
            },

            function combineChapterList( _callback) {
                var numericInfo = {};

                // 챕터 조합 시작
                for( var chapterKey in chapterList ) {
                    var chapterItem = chapterList[ chapterKey ]
                    var countDone = 0;
                    for( var i = 0; i < chapterItem.length; i++) {

                        var eachItem = chapterList[ chapterKey][i];

                        if( progressList.hasOwnProperty( eachItem.seq) && progressList[eachItem.seq] ) {
                            chapterList[ chapterKey][i].success = true;
                            countDone++;
                        }
                        else {
                            chapterList[ chapterKey][i].success = false;
                        }
                    } /* END INNER LOOP */

                    numericInfo[ chapterKey] = Math.round( (countDone / (chapterItem.length * 1.0) ) * 100 );

                } /* END OUTER LOOP */


                _callback( null, numericInfo );
            }
        ],

            function finalExec( err, result ) {
                var data = {
                    chapterInfo : chapterList,
                    numericInfo : result
                }

                res.json(u.result( data) );
            }
        );
    }

}



/* export */
module.exports = controller;