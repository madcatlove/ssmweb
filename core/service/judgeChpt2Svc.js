/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');
var jUtils = require('../jUtils');

var judgeChpt2 = {


    /**
     * 5) 직육면체
     * 1. 각 면에 대한 노멀벡터를 구하여 반대 면에 대한 벡터의 합이 0인가
     * 2. 두 면만 확인
     * @param extraInfo
     * @param data
     * @param callback
     */
    rect : function ( extraInfo, data, callback) {

        var messages = [];

        var sPoint = extraInfo.startpoint;

        if (data[0].blockType != jUtils.BEGIN || data[5].blockType != jUtils.END &&
            data[6].blockType != jUtils.BEGIN || data[11].blockType != jUtils.END) {

            messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);

        } else {

            if (!jMath.isEqualFloat(
                    [[data[1].data.x, sPoint[0].x], [data[1].data.y, sPoint[0].y], [data[1].data.z, sPoint[0].z]]) ||
                !jMath.isEqualFloat(
                    [[data[7].data.x, sPoint[1].x], [data[7].data.y, sPoint[1].y], [data[7].data.z, sPoint[1].z]])) {

                messages.push(jUtils.MSG_CHK_START_POINT);

            }

            /**
             * 각 면에대한 노멀벡터 구하기
             * @type {*[]}
             */
            var normals = [
                jMath.normal3f([data[1].data, data[2].data, data[3].data]), // 윗면
                jMath.normal3f([data[7].data, data[8].data, data[9].data]), // 밑면

                jMath.normal3f([data[2].data, data[3].data, data[4].data]), // 윗면
                jMath.normal3f([data[8].data, data[9].data, data[10].data]), // 밑면
            ];

            if (!jMath.isSumOfNormalZero(normals[0], normals[1]) || !jMath.isSumOfNormalZero(normals[2], normals[3])) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

            }
        }

        callback(messages);

    },

    /**
     * 6) 직육면체 High
     * 1. 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    box : function( extraInfo, data, callback) {

        var messages = [];

        var sPoint = extraInfo.startpoint;

        if (data[0].blockType != jUtils.DRAWBOX) {

            messages.push(jUtils.MSG_WRONG_BLOCK_TYPE);

        } else if (!jMath.isEqualFloat( [ [data[0].data.x, sPoint.x], [data[0].data.y, sPoint.y],
                [data[0].data.z, sPoint.z], [data[0].data.size, extraInfo.size] ] ) ) {

            messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

        }

        callback(messages);

    },

    /**
     * 7) 구 High
     * 1. 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    sphere : function( extraInfo, data, callback) {

        var messages = [];

        if (data[0].blockType != jUtils.DRAWSPHERE) {

            messages.push(jUtils.MSG_WRONG_BLOCK_TYPE);

        } else if (!jMath.isEqualFloat(
                [
                    [data[0].data.Lo, extraInfo.Lo],
                    [data[0].data.La, extraInfo.La],
                    [data[0].data.R, extraInfo.R],
                ]
            )) {

            messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

        }

        callback(messages);

    }

};


module.exports = judgeChpt2;