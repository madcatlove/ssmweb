/**
 * Created by Lee on 2015-01-23.
 */

var controller = {

    /* 튜토리얼 진행 컨트롤러 */
    procTutorial : function(req, res) {
        var sess = req.session;

        var opt = {
            extraJS : ['sblock/moveblock.js', 'threejs/three.js', 'threejs/blocklib.js', 'tutorial.js', 'sblock/sblock.js'],
            extraCSS : ['blocks.css'],
            member : sess.member

        }
        res.render('tutorial', opt);
    }


}



/* export */
module.exports = controller;