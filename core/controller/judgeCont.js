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

        var memberSession = req.session.member;

        var params = {
            jid :  req.jid,
            data : JSON.parse(req.data),
            member : memberSession
        };

        /**
         * judgeSvc의 execJudge를 통하여 판정을 기다린다
         */
        judgeService.execJudge(params, function( messages) {
            var result;
            if( messages.length > 0 ) {
                result = u.result( messages, true );
            }
            else {
                result = u.result( messages, false );
            }
            console.log('judge return = '+ result[0]);
            res.json( result );
        });

    }

}



/* export */
module.exports = controller;