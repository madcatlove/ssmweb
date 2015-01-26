/**
 * Created by jangjunho on 15. 1. 26..
 */

var controller = {

    procJudge : function (req, res) {

        // judge 번호는
        // 미들웨어에서 jid 로 req 에 삽입되서 넘어온다.

        console.log( 'judge number : ', req.jid );

        res.send(req.body);

    }



}



/* export */
module.exports = controller;