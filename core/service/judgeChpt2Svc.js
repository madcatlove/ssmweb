/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');

var judgeChpt2 = {

    rect : function (data, callback) {
        var dummy = [
            // CCW
            [-1.0, 1.0, 1.0],
            [-1.0, -1.0, 1.0],
            [1.0, -1.0, 1.0],
            [1.0, 1.0, 1.0],

            // CW
            [-1.0, 1.0, -1.0],
            [-1.0, -1.0, -1.0],
            [1.0, -1.0, -1.0],
            [1.0, 1.0, -1.0],

        ];

        var normals = [
            jMath.normal3f([ dummy[0], dummy[1], dummy[2], dummy[3] ]),
            jMath.normal3f([ dummy[4], dummy[7], dummy[6], dummy[5] ]),

            jMath.normal3f([ dummy[4], dummy[0], dummy[3], dummy[7] ]),
            jMath.normal3f([ dummy[5], dummy[6], dummy[2], dummy[1] ]),

            jMath.normal3f([ dummy[3], dummy[2], dummy[6], dummy[7] ]),
            jMath.normal3f([ dummy[0], dummy[4], dummy[5], dummy[1] ])
        ];

        var res = [0, 0, 0];

        for (var i = 0 ; i < normals.length ; i ++) {
            for (var j = 0 ; j < 3; j ++) {
                res[j] += normals[i][j];
            }
        }

        return (res[0] == 0) && (res[1] == 0) && (res[2] == 0);

    },

    pyramid : function (data, callback) {

    },

    circle : function(data, callback) {
        var dummy = [0.0, 0.0, 0.0, 5];

    },

    cylinder : function(data, callback) {

    }

};


module.exports = judgeChpt2;