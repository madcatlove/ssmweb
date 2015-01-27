/**
 * Created by jangjunho on 15. 1. 26..
 */
var jMath = require('../Math');

var judgeChpt1 = {

    /**
     * 1) 점 판정
     * 1. 점은 x, y, z 세 축으로 이룸
     * @param data
     * @param callback
     */
    point : function (blockInfo, extraInfo, data, callback) {
        var res = false;

        var block = data[0];
        var sPoint = extraInfo.startpoint;

        if (block.blockType == blockInfo[0] &&
            parseFloat(block.data.x) == parseFloat(sPoint.x)  &&
            parseFloat(block.data.y) == parseFloat(sPoint.y) ) {

            res = true;
        }

        callback(res);
    },

    /**
     * 2) 선 판정
     * 1. 2개의 점
     * @param data
     * @param callback
     */
    line : function (blockInfo, extraInfo, data, callback) {
        var res = true;
        var sPoint = extraInfo.startpoint;
        var dis = parseFloat(extraInfo.distance);

        if (data[0].blockType == 1 &&
            parseFloat(data[1].data.x) == parseFloat(sPoint.x)  &&
            parseFloat(data[1].data.y) == parseFloat(sPoint.y) ) {

            var dist1 = parseFloat(jMath.distance2f([data[1], data[2]]));
            var dist2 = parseFloat(jMath.distance2f([data[2], data[3]]));

            if (dist1 != dis ||
                dist2 != dis ||
                data[4].blockType != 2) {

                res = false;

            }

        } else {
            res = false;
        }

        callback(res);

    },

    /**
     * 3) 삼각형 판정
     * 1. 점이 3개 필요
     * 2. 세개의 점의 패러미터와 위치가 일치
     * @param data
     * @param callback
     */
    triangle : function(blockInfo, extraInfo, data, callback) {
        var res = true;
        var sPoint = extraInfo.startpoint;
        var seq = extraInfo.seq;

        if (data[0].blockType == 1 &&
            parseFloat(data[1].data.x) == parseFloat(sPoint.x)  &&
            parseFloat(data[1].data.y) == parseFloat(sPoint.y) ) {

            if (parseFloat(data[2].data.x)  != parseFloat(seq[0].x) ||
                parseFloat(data[2].data.y)  != parseFloat(seq[0].y) ||

                parseFloat(data[3].data.x)  != parseFloat(seq[1].x) ||
                parseFloat(data[3].data.y)  != parseFloat(seq[1].y) ||

                data[4].blockType != 2) {

                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    },

    /**
     * 4) 사각형 판정
     * 1. 점이 4개 필요
     * 2. 네개의 점의 패러미터와 위치가 일치
     * @param data
     * @param callback
     */
    quadangle : function(blockInfo, extraInfo, data, callback) {
        var res = true;
        var sPoint = extraInfo.startpoint;
        var seq = extraInfo.seq;


        if (data[0].blockType == 1 &&
            parseFloat(data[1].data.x) == parseFloat(sPoint.x)  &&
            parseFloat(data[1].data.y) == parseFloat(sPoint.y) ) {

            if (parseFloat(data[2].data.x)  != parseFloat(seq[0].x) ||
                parseFloat(data[2].data.y)  != parseFloat(seq[0].y) ||

                parseFloat(data[3].data.x)  != parseFloat(seq[1].x) ||
                parseFloat(data[3].data.y)  != parseFloat(seq[1].y) ||

                parseFloat(data[4].data.x)  != parseFloat(seq[2].x) ||
                parseFloat(data[4].data.y)  != parseFloat(seq[2].y) ||

                data[5].blockType != 2) {

                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    }


};

module.exports = judgeChpt1;