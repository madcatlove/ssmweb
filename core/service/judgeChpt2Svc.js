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

        if (data[0].blockType == 1 && data[9].blockType == 2 &&
            jMath.isEqualFloat([[data[1].data.x, sPoint.x], [data[1].data.y, sPoint.y]]) ) {

            /**
             * 각 면에대한 노멀벡터 구하기
             * @type {*[]}
             */
            var normals = [
                jMath.normal3f( [data[1].data, data[2].data, data[3].data, data[4].data] ), // 앞면
                jMath.normal3f( [data[5].data, data[8].data, data[7].data, data[6].data] ), // 뒷면

                jMath.normal3f( [data[5].data, data[1].data, data[4].data, data[8].data] ), // 윗면
                jMath.normal3f( [data[6].data, data[7].data, data[3].data, data[2].data] ), // 아랫면

                jMath.normal3f( [data[4].data, data[3].data, data[7].data, data[8].data] ), // 오른면
                jMath.normal3f( [data[1].data, data[5].data, data[6].data, data[2].data] ), // 왼면
            ];

            if (!jMath.isSumOfNormalZero(normals[0], normals[1]) || // 앞면과 뒷면에 노멀벡터의 합이 0인가
                !jMath.isSumOfNormalZero(normals[2], normals[3]) || // 윗면, 아랫면
                !jMath.isSumOfNormalZero(normals[4], normals[5]) ) { // 오른면, 왼면

                res = false;
            }

        } else {
            res = false;
        }

        callback(res);

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