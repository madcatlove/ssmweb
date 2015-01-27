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

        console.log(extraInfo+"");

        var block = data[0];

        if (block.blockType == blockInfo[0] &&
            block.data.x == 1.0  &&
            block.data.y == 1.0) {

            res = true;

        }

        callback(res);
    },

    /**
     * 2) 선 판정
     * 1. 2개의 점
     * 2.
     * @param data
     * @param callback
     */
    line : function (blockInfo, extraInfo, data, callback) {
        var res = false;


        for (var i = 0 ; i < data.length ; i ++) {

            var block = data[i];


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
        var dummy = [
            [-1.0, 0.0, 0.5],
            [1.0, 1.0, 1.0],
            [0.0, 2.0, 0.0],

        ];

        jMath.area2f(dummy);
    },

    /**
     * 4) 사각형 판정
     * 1. 시작점 비교
     * 2. 넓이 비교( 넓이를 구할 때 CCW가 보장되어야 하므로 방향이 다른 경우에 결과가 다름)
     * @param data
     * @param callback
     */
    quadangle : function(blockInfo, extraInfo, data, callback) {
        var dummy = [
            [-1.0, 1.0, 0.0],
            [-1.0, -1.0, 0.0],
            [1.0, -1.0, 0.0],
            [1.0, 1.0, 0.0]
        ];

        jMath.area2f(dummy);
    }


};

module.exports = judgeChpt1;