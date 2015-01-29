/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');
var bType = require('../BlockType');

var judgeChpt2 = {

    // 변경 - 모든 면 -> 두면 만
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

        if (data[0].blockType == bType.BEGIN && data[5].blockType == bType.END &&
            data[6].blockType == bType.BEGIN && data[11].blockType == bType.END &&

            jMath.isEqualFloat([[data[1].data.x, sPoint[0].x], [data[1].data.y, sPoint[0].y], [data[1].data.z, sPoint[0].z]] ) &&
            jMath.isEqualFloat([[data[7].data.x, sPoint[1].x], [data[7].data.y, sPoint[1].y], [data[7].data.z, sPoint[1].z]] )) {

            /**
             * 각 면에대한 노멀벡터 구하기
             * @type {*[]}
             */
            var normals = [
                jMath.normal3f( [data[1].data, data[2].data, data[3].data] ), // 윗면
                jMath.normal3f( [data[7].data, data[8].data, data[9].data] ), // 밑면

                jMath.normal3f( [data[2].data, data[3].data, data[4].data] ), // 윗면
                jMath.normal3f( [data[8].data, data[9].data, data[10].data] ), // 밑면
            ];

            console.log(normals);

            if (!jMath.isSumOfNormalZero(normals[0], normals[1]) ||
                !jMath.isSumOfNormalZero(normals[2], normals[3])
            ) {

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
        var sPoint = extraInfo.startpoint;

        var res = data[0].blockType == bType.DRAW_BOX &&
            jMath.isEqualFloat([[data[0].data.x, sPoint.x], [data[0].data.y, sPoint.y],
                [data[0].data.z, sPoint.z], [data[0].data.size, extraInfo.size]]) ;

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

        var res = data[0].blockType == bType.DRAW_SPHERE && jMath.isEqualFloat(
            [
                [data[0].data.d, size.d]
            ]
        );

        callback(res);

    }

};


module.exports = judgeChpt2;