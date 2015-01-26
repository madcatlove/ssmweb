/**
 * Created by jangjunho on 15. 1. 26..
 */

var controller = {

    ///* 튜토리얼 진행 컨트롤러 */
    //procTutorial : function(req, res) {
    //    res.send( 'Hello' + req.tid );
    //}

    judge : function (req, res) {
        res.send(req.body);

    }



}



/* export */
module.exports = controller;