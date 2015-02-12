/**
 * Created by jangjunho on 15. 1. 26..
 */
var jMath = require('../Math');
var jUtils = require('../jUtils');

var judgeChpt1 = {

    /**
     * 1) 점
     * 1. 점의 좌표가 일치하는가
     * @param extraInfo
     * @param data
     * @param callback
     */
    point : function ( extraInfo, data, callback) {

        var messages = [];

        var points = extraInfo.points;

        for (var i = 0 ; i < data.length ; i ++) {
            if (data[i].blockType == jUtils.VERTEX2) {

                for (var j = 0 ; j < points.length; j++) {
                    var cmpVals = [];

                    cmpVals.push([data[i].data.x, points[j].x]);
                    cmpVals.push([data[i].data.y, points[j].y]);

                    if (jMath.isEqualFloat(cmpVals)) {
                        points.splice(j,1);
                        break;
                    }
                }

            } else {

                messages.push(jUtils.MSG_WRONG_BLOCK_TYPE);

            }

        }

        if (points.length != 0) {
            messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
        }

        callback(messages);

    },

    /**
     * 2) 선
     * 1. BEGIN, END가 제대로 되어있는가
     * 2. 시작점이 일치하는가
     * 3. 점과 점 사이의 거리가 데이터베이스에서 설정된 값과 일치하는가
     * @param extraInfo
     * @param data
     * @param callback
     */
    line : function ( extraInfo, data, callback) {

        var messages = [];

        var sPoint = extraInfo.startpoint;
        var dis = parseFloat(extraInfo.distance); // 데이터베이스의 엑스트라 인포에서 거리정보

        /**
         * 첫 블럭의 타입이 1(비긴)인지, 시작점이 일치하는지 확인
         */
        if (data[0].blockType != jUtils.BEGIN || data[4].blockType != jUtils.END) {

            messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);

        } else {

            if (!jMath.isEqualFloat([[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]])) {

                messages.push(jUtils.MSG_CHK_START_POINT);

            }

            /**
             * 점과 점 사이의 거리를 구하여 해당 거리가 데이터베이스의 거리와 일치하는지
             * @type {Number}
             */
            if (jMath.distance2f([data[1], data[2]]) != dis ||
                jMath.distance2f([data[2], data[3]]) != dis) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

            }

        }

        callback(messages);

    },

    /**
     * 3) 삼각형
     * 1. BEGIN, END가 제대로 되어있는가
     * 2. BEGIN, END가 두 쌍인가
     * 3. 시작점이 일치하는가
     * 4. 데이터베이스에 저장된 순서 데이터와 일치하는가
     * @param extraInfo
     * @param data
     * @param callback
     */
    triangle : function( extraInfo, data, callback) {

        var messages = [];

        var sPoint = extraInfo.startpoint;
        var seq = extraInfo.seq; // 데이터베이스의 엑스트라 인포에서 점의 순서 정보

        if (data[0].blockType != jUtils.BEGIN || data[4].blockType != jUtils.END ) {

            messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);

        } else {

            if (!jMath.isEqualFloat([[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]])) {

                messages.push(jUtils.MSG_CHK_START_POINT);

            }

            /**
             *  점의 순서정보와 넘어온 블럭 정보들을 비교
             */
            if (!jMath.isEqualFloat(
                    [
                        [data[2].data.x, seq[0].x],
                        [data[2].data.y, seq[0].y],
                        [data[3].data.x, seq[1].x],
                        [data[3].data.y, seq[1].y],
                    ])) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
            }

        }

        callback(messages);

    },

    /**
     * 4) 사각형
     * 1. BEGIN, END가 제대로 되어있는가
     * 2. 시작점이 일치하는가
     * 3. 데이터베이스에 저장된 순서 데이터와 일치하는가
     * @param extraInfo
     * @param data
     * @param callback
     */
    quadangle : function( extraInfo, data, callback) {

        var messages = [];

        var sPoint = extraInfo.startpoint;
        var seq = extraInfo.seq;

        if (data[0].blockType != jUtils.BEGIN || data[5].blockType != jUtils.END) {

            messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);

        } else {

            if (!jMath.isEqualFloat([[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]])) {

                messages.push(jUtils.MSG_CHK_START_POINT);

            }

            if (!jMath.isEqualFloat(
                    [
                        [data[2].data.x, seq[0].x],
                        [data[2].data.y, seq[0].y],
                        [data[3].data.x, seq[1].x],
                        [data[3].data.y, seq[1].y],
                        [data[4].data.x, seq[2].x],
                        [data[4].data.y, seq[2].y],
                    ])) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

            }

        }

        callback(messages);

    }


};

module.exports = judgeChpt1;