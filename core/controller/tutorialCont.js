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
                'syntax/shCore.js', 'syntax/shAutoloader.js', 'syntax/shBrushCpp.js'],
            extraCSS : ['blocks.css',
                        'shCore.css', 'shThemeDefault.css'],
            member : sess.member,
            tid : req.tid
        }


        async.waterfall([

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
                    console.log( ' ttttt ', result);
                    _callback( null );
                })
            },

            /* 튜토리얼 진행상황 리스트 생성 */
            function makeProgressList( _callback) {
                tutorialService.getTutorialProgressInfo( sess.member, function(result) {
                    opt.tutorialProgressList = result;
                    _callback( null );
                })
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

}



/* export */
module.exports = controller;