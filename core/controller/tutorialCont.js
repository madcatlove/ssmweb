/**
 * Created by Lee on 2015-01-23.
 */

var controller = {

    /* 튜토리얼 진행 컨트롤러 */
    procTutorial : function(req, res) {
        res.send( 'Hello' + req.tid );
    }





}



/* export */
module.exports = controller;