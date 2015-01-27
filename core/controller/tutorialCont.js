/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var tutorialService = require('../service/tutorialSvc');

var controller = {

    /* 튜토리얼 진행 컨트롤러 */
    procTutorial : function(req, res) {
        var sess = req.session;

        var opt = {
            extraJS : ['sblock/moveblock.js', 'threejs/three.js', 'threejs/blocklib.js', 'tutorial.js', 'sblock/sblock.js'],
            extraCSS : ['blocks.css'],
            member : sess.member,
            tid : req.tid,

        }
        res.render('tutorial', opt);
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