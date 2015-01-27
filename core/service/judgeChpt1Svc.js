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
     * 1. 2개의 점
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
     * 1. 점이 3개 필요
     * 2. 세개의 점의 패러미터와 위치가 일치
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
     * 1. 시작점 비교
     * 2. 넓이 비교( 넓이를 구할 때 CCW가 보장되어야 하므로 방향이 다른 경우에 결과가 다름)
     * @param data
     * @param callback
     */
    quadangle : function(data, callback) {
        console.log("quadangle");
        var dummy = [
            [-1.0, 1.0, 0.0],
            [-1.0, -1.0, 0.0],
            [1.0, -1.0, 0.0],
            [1.0, 1.0, 0.0]
        ];

        jMath.area2f(dummy);
    },

    /**
     * 원 판정
     * @param data
     * @param callback
     */
    circle : function(data, callback) {
        var dummy = [0.0, 0.0, 5];




    },

    /**
     * 다각형 판정
     * 1. 시작점 비교
     * 2. 넓이 비교( 넓이를 구할 때 CCW가 보장되어야 하므로 방향이 다른 경우에 결과가 다름)
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