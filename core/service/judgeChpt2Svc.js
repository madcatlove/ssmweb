/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');

var judgeChpt2 = {

    /**
     * 5) 직육면체 Low 판정
     * 1. 각 면에 대한 노멀벡터를 구하여 반대 면에 대한 벡터의 합이 0인지 확인
     * 2. 3쌍의 벡터의 합이 모두 0이면 통과
     * 3. 각 면에 대한 벡터의 크기는 면에 크기에 따라 다르므로 넓이를 구하여 계산 할 필요 없음
     * @param data
     * @param callback
     */
    rect : function (blockInfo, extraInfo, data, callback) {
        var res = true;
        var sPoint = extraInfo.startpoint;
        var size = extrainfo.size

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

        //
        //var dummy = [
        //    // CCW
        //    [-1.0, 1.0, 1.0],
        //    [-1.0, -1.0, 1.0],
        //    [1.0, -1.0, 1.0],
        //    [1.0, 1.0, 1.0],
        //
        //    // CW
        //    [-1.0, 1.0, -1.0],
        //    [-1.0, -1.0, -1.0],
        //    [1.0, -1.0, -1.0],
        //    [1.0, 1.0, -1.0],
        //
        //];
        //
        //var normals = [
        //    jMath.normal3f([ dummy[0], dummy[1], dummy[2], dummy[3] ]),
        //    jMath.normal3f([ dummy[4], dummy[7], dummy[6], dummy[5] ]),
        //
        //    jMath.normal3f([ dummy[4], dummy[0], dummy[3], dummy[7] ]),
        //    jMath.normal3f([ dummy[5], dummy[6], dummy[2], dummy[1] ]),
        //
        //    jMath.normal3f([ dummy[3], dummy[2], dummy[6], dummy[7] ]),
        //    jMath.normal3f([ dummy[0], dummy[4], dummy[5], dummy[1] ])
        //];
        //
        //var res = [0, 0, 0];
        //
        //for (var i = 0 ; i < normals.length ; i ++) {
        //    for (var j = 0 ; j < 3; j ++) {
        //        res[j] += normals[i][j];
        //    }
        //}
        //
        //console.log(normals);

        //return (res[0] == 0) && (res[1] == 0) && (res[2] == 0);

    },

    /**
     * 6) 직육면체 High 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    box : function(blockInfo, extraInfo, data, callback) {
        var size = extraInfo.size;

        var res = jMath.isEqualFloat(
            [
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]
            ]
        );

        callback(res);
    },


    /**
     * 7) 구 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    sphere : function(blockInfo, extraInfo, data, callback) {
        var size = extraInfo.size;

        var res = jMath.isEqualFloat(
            [
                [data[0].data.d, size.d]
            ]
        );

        callback(res);

    }

};


module.exports = judgeChpt2;