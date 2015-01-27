/**
 * Created by jangjunho on 15. 1. 26..
 */

var u = require('../Util');
var judgeService = require('../service/judgeSvc');

var controller = {

    /**
     * 패러미터 객체를 만들고 판정 시작
     * @param req
     * @param res
     */
    procJudge : function (req, res) {

        // judge 번호는
        // 미들웨어에서 jid 로 req 에 삽입되서 넘어온다.

        var params = {
            jid :  req.jid,
            data : JSON.parse(req.data)
        };

        /**
         * judgeSvc의 execJudge를 통하여 판정을 기다린다
         */
        judgeService.execJudge(params, function(isOk) {
            res.send( {'isOk' : isOk} );

        });

    }

}



/* export */
module.exports = controller;