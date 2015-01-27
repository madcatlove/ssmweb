/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');

var judgeChpt2 = {

    /**
     * 직육면체 판정
     * 1. 각 면에 대한 노멀벡터를 구하여 반대 면에 대한 벡터의 합이 0인지 확인
     * 2. 3쌍의 벡터의 합이 모두 0이면 통과
     * 3. 각 면에 대한 벡터의 크기는 면에 크기에 따라 다르므로 넓이를 구하여 계산 할 필요 없음
     * @param data
     * @param callback
     */
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

        console.log(normals);

        //return (res[0] == 0) && (res[1] == 0) && (res[2] == 0);

    },

    /**
     * 사각뿔 판정
     * @param data
     * @param callback
     */
    pyramid : function (data, callback) {

    },

    /**
     * 구 판정
     * @param data
     * @param callback
     */
    sphere : function(data, callback) {
        var dummy = [0.0, 0.0, 0.0, 5];

    },

    /**
     * 원통 판정
     * @param data
     * @param callback
     */
    cylinder : function(data, callback) {

    }

};


module.exports = judgeChpt2;