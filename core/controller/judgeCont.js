/**
 * Created by jangjunho on 15. 1. 26..
 */

var u = require('../Util');
var judgeService = require('../service/judgeSvc');

var controller = {

    procJudge : function (req, res) {

        // judge 번호는
        // 미들웨어에서 jid 로 req 에 삽입되서 넘어온다.

        var params = {
            jid :  req.jid,
            data :  req.jid
        };

        judgeService.execJudge(params, function(isOk) {
            res.send( {'isOk' : isOk} );

        });

    }

}



/* export */
module.exports = controller;