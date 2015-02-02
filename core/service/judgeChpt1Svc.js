/**
 * Created by jangjunho on 15. 1. 26..
 */
var jMath = require('../Math');
var bType = require('../BlockType');

var judgeChpt1 = {

    /**
     * 1) 점 판정
     * 1. 점은 x, y, z 세 축으로 이룸
     * @param data
     * @param callback
     */
    point : function (blockInfo, extraInfo, data, callback) {
       // var res = false;
        var messages = [];

        var block = data[0]; // 포스트를 통하여 넘어온 블럭 데이터들중 가장 처음 블럭
        var sPoint = extraInfo.startpoint; // 데이터베이스의 엑스트라 인포에서 시작점

        /**
         * 데이터베이스에서의 블럭 타입과 넘어온 데이터의 블럭 타입이 일치하는지 확인하고
         * float으로 형변환하여 x,y 좌표가 맞는지 확인한다
         */

        if (block.blockType != bType.VERTEX2) {
            messages.push('올바르지 않은 블럭 타입입니다');
        }

        if (!jMath.isEqualFloat([[block.data.x, sPoint.x], [block.data.y, sPoint.y]])) {
            messages.push('블럭의 입력 값이 옳지 않습니다');
        }

        callback(messages);
    },

    /**
     * 2) 선 판정
     * 1. 2개의 점
     * @param data
     * @param callback
     */
    line : function (blockInfo, extraInfo, data, callback) {
        var messages = [];

        var sPoint = extraInfo.startpoint;
        var dis = parseFloat(extraInfo.distance); // 데이터베이스의 엑스트라 인포에서 거리정보

        /**
         * 첫 블럭의 타입이 1(비긴)인지, 시작점이 일치하는지 확인
         */
        if (data[0].blockType != bType.BEGIN ||
            data[4].blockType != bType.END
            ) {

            messages.push('BEGIN, END를 확인하여 주세요')

        }

        if (jMath.isEqualFloat( [[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]]) ) {

            messages.push('Vertex의 시작 점을 확인 해주세요')

        }

        /**
         * 점과 점 사이의 거리를 구하여 해당 거리가 데이터베이스의 거리와 일치하는지
         * @type {Number}
         */
        if (jMath.distance2f([data[1], data[2]]) != dis ||
            jMath.distance2f([data[2], data[3]]) != dis) {

            messages.push('Vertex의 입력 값을 확인 해주세요')

        }

        callback(messages);

    },

    /**
     * 3) 삼각형 판정
     * 1. 점이 3개 필요
     * 2. 세개의 점의 패러미터와 위치가 일치
     * @param data
     * @param callback
     */
    triangle : function(blockInfo, extraInfo, data, callback) {
        var messages = [];

        var sPoint = extraInfo.startpoint;
        var seq = extraInfo.seq; // 데이터베이스의 엑스트라 인포에서 점의 순서 정보

        if (data[0].blockType == bType.BEGIN &&  data[4].blockType == bType.END ) {

            messages.push('BEGIN, END를 확인하여 주세요')

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
                ]
            ) ) {

            res = false;
        }

        if (jMath.isEqualFloat( [[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]] ) ) {


        }
        callback(messages);
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
        var message = [];

        if (data[0].blockType == bType.BEGIN &&  data[5].blockType == bType.END &&
            jMath.isEqualFloat([[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]]) ) {

            if (!jMath.isEqualFloat(
                    [
                        [data[2].data.x, seq[0].x],
                        [data[2].data.y, seq[0].y],
                        [data[3].data.x, seq[1].x],
                        [data[3].data.y, seq[1].y],
                        [data[4].data.x, seq[2].x],
                        [data[4].data.y, seq[2].y],
                    ] ) ) {

                //res = false;
                message.push('  에러낫음 ㅋ');
            }

        } else {
            res = false;
        }

        callback(message);
    }


};

module.exports = judgeChpt1;