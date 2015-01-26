/**
 * Created by jangjunho on 15. 1. 26..
 */

var judgeChpt1 = require('./judgeChpt1Svc'),
    judgeChpt2 = require('./judgeChpt2Svc'),
    judgeChpt3 = require('./judgeChpt3Svc');

var judge = [
    [judgeChpt1.point, judgeChpt1.line, judgeChpt1.triangle, judgeChpt1.quadangle, judgeChpt1.polygon],
    [judgeChpt2.rect, judgeChpt2.pyramid, judgeChpt2.circle, judgeChpt2.cylinder],
    [judgeChpt3.rotate, judgeChpt3.translate, judgeChpt3.scale, judgeChpt3.pushPop, judgeChpt3.camera, judgeChpt3.dirLight, judgeChpt3.spotLight]
];

var service = {

    execJudge : function(params, callback) {
        // chapter number(1 ~ 3), chapter sequence (1 ~ 8)
        // getNumber From DA

        //var chpt = 0, seq = 0;

        judge[0][3](params, callback);
    }

}

module.exports = service;