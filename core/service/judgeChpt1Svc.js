/**
 * Created by jangjunho on 15. 1. 26..
 */
var jMath = require('../Math');

var judgeChpt1 = {

    /**
     * 점 판정
     * 1. 점은 x, y, z 세 축으로 이룸
     * @param data
     * @param callback
     */
    point : function (data, callback) {
        var dummy = [1.0, 2.0, 0.0];

        console.log('dummy = ' + dummy)
        callback(dummy.length == 3);
    },

    /**
     * 선 판정
     * 1. 선은 2개의 점이 필요함
     * 2.
     * @param data
     * @param callback
     */
    line : function (data, callback) {
        var dummy = [
            [1.0, 2.0, 3.0],
            [4.0, 5.0, 6.0]
        ];


        var isOk = true;

        //if (dummy.length == 2 && dummy[0].length == 3 && dummy[1].length == 3) {
        //    isOk = false;
        //} else if (jMath.distance3d(dummy[0], dummy[1]) == )
        console.log(jMath.distance3f(dummy[0], dummy[1])+' ??');

        callback(jMath.distance3f(dummy[0], dummy[1]) == 10);
    },

    /**
     * 삼각형 판정
     * @param data
     * @param callback
     */
    triangle : function(data, callback) {
        var dummy = [
            [-1.0, 0.0, 0.5],
            [1.0, 1.0, 1.0],
            [0.0, 2.0, 0.0],

        ];

        jMath.area2f(dummy);
    },

    /**
     * 사각형 판정
     * @param data
     * @param callback
     */
    quadangle : function(data, callback) {
        var dummy = [
            [-1.0, 1.0, 0.0],
            [-1.0, -1.0, 0.0],
            [1.0, -1.0, 0.0],
            [1.0, 1.0, 0.0]
        ];

        jMath.area2f(dummy);
    },

    /**
     * 다각형 판정
     * @param data
     * @param callback
     */
    polygon : function(data, callback) {
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