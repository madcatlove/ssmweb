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
                'sblock/moveblock.js', 'threejs/three.js', 'threejs/OrbitControls.js',
                'gl/sgl.js', 'tutorial.js',
                'sblock/sblock.js'],
            extraCSS : ['blocks.css'],
            member : sess.member,
            tid : req.tid,

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