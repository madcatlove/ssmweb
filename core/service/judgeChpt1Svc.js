/**
 * Created by jangjunho on 15. 1. 26..
 */
var jMath = require('../Math');

var judgeChpt1 = {

    point : function (data, callback) {
        var dummy = [1.0, 2.0, 0.0];

        callback(dummy.length == 3);
    },

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

    triangle : function(data, callback) {
        var dummy = [
            [-1.0, 0.0, 0.5],
            [1.0, 1.0, 1.0],
            [0.0, 2.0, 0.0],

        ];

        jMath.normal3f(dummy[0], dummy[1], dummy[2]);


    },

    quadangle : function(data, callback) {


    },

    polygon : function(data, callback) {

    }
};

module.exports = judgeChpt1;