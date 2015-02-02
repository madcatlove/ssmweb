/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');
var jUtils = require('../jUtils');

var judgeChpt3 = {

    /**
     * 8) 물체 이동 판정
     * 1. 입력 패러미터 비교 or 매트릭스 계산 후 비교
     * @param data
     * @param callback
     */
    translate : function (  extraInfo, data, callback) {

        var messages = [];

        var seq = extraInfo.seq;

        /**
         * 입력 패러미터 비교 방식
         */
        for (var i = 0 ; i < data.length ; i ++) {

            if (data[i].blockType != seq[i].bType) {

                messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);
                break;

            }

            var cmpVals = [];

            if (data[i].blockType == jUtils.DRAWBOX) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);
                cmpVals.push([seq[i].info.size, data[i].data.size]);


            } else if (data[i].blockType == jUtils.TRANSLATE) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 9)  물체 회전 판정
     * 1. 입력 패러미터 비교 or 매트릭스 계산 후 비교
     * @param data
     * @param callback
     */
    rotate : function (  extraInfo, data, callback) {

        var res = true;

        var size = extraInfo.size;
        var rotate = extraInfo.rotate;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == jUtils.DRAWBOX && data[1].blockType == jUtils.ROTATE) {

            var isProperBox = jMath.isEqualFloat([
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]]);

            var isProperRotate =  jMath.isEqualFloat([
                [data[1].data.t, rotate.t],
                [data[1].data.x, rotate.x],
                [data[1].data.y, rotate.y],
                [data[1].data.z, rotate.z]]);

            if (!isProperBox || !isProperRotate) {

                res = false;

            }

        } else {

            res = false;

        }

        callback(res);

    },

    /**
     * 10) 물체 확대 판정
     * 1. 입력 패러미터 비교 or 매트릭스 계산 후 비교
     * @param data
     * @param callback
     */
    scale : function (  extraInfo, data, callback) {

        var messages = [];

        var seq = extraInfo.seq;

        /**
         * 입력 패러미터 비교 방식
         */
        for (var i = 0 ; i < data.length ; i ++) {

            if (data[i].blockType != seq[i].bType) {

                messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);
                break;

            }

            var cmpVals = [];

            if (data[i].blockType == jUtils.DRAWBOX) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);
                cmpVals.push([seq[i].info.size, data[i].data.size]);

            } else if (data[i].blockType == jUtils.SCALE) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 11) 푸시 팝 매트릭스 판정
     * @param data
     * @param callback
     */
    pushPop : function (  extraInfo, data, callback) {

        var messages = [];

        var seq = extraInfo.seq;

        /**
         * 입력 패러미터 비교 방식
         */
        for (var i = 0 ; i < data.length ; i ++) {

            if (data[i].blockType != seq[i].bType) {

                messages.push(jUtils.MSG_WRONG_BLOCK_SEQ);
                break;

            }

            var cmpVals = [];

            if (data[i].blockType == jUtils.DRAWBOX) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);
                cmpVals.push([seq[i].info.size, data[i].data.size]);

            } else if (data[i].blockType == jUtils.TRANSLATE) {

                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);

            } else {

                continue;

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 12) 펄스펙티브 카메라 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    perspective : function (  extraInfo, data, callback) {

    },

    /**
     * 13) 오쏘고날 카메라 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    orthogonal : function (  extraInfo, data, callback) {

    },

    /**
     * 14) 카메라 포지션 / 룩엣 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    positionLookat : function (  extraInfo, data, callback) {

        var messages = [];

        var objs = extraInfo.objs;
        var cam = extraInfo.cam;
        var lookat = extraInfo.lookat;


        for (var i = 0 ; i < data.length ; i ++ ){

            if (data[i].blockType == jUtils.DRAWBOX) {

                for (var j = 0 ; j < objs.length; j ++) {

                    var cmpVals = [];

                    cmpVals.push([objs[j].x, data[i].data.x]);
                    cmpVals.push([objs[j].y, data[i].data.y]);
                    cmpVals.push([objs[j].z, data[i].data.z]);
                    cmpVals.push([objs[j].size, data[i].data.size]);

                    if (jMath.isEqualFloat(cmpVals)) {

                        objs.remove(j);
                        break;

                    }

                }

            } else {

                var cmpVals = [];
                var target;

                if (data[i].blockType == jUtils.CAMERAPOSITION) {

                    target = cam;

                } else if (data[i].blockType == jUtils.LOOKAT) {

                    target = lookat;

                }

                cmpVals.push([target.x, data[i].data.x]);
                cmpVals.push([target.y, data[i].data.y]);
                cmpVals.push([target.z, data[i].data.z]);

                if (!jMath.isEqualFloat(cmpVals)) {

                    messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                    break;

                }

            }

        }

        callback(res);

    },

    /**
     * 15) 디렉셔널 라이트
     * @param blockInfo
     * @param extraInfo
     * @param data
     * @param callback
     */
    dirLight : function (  extraInfo, data, callback) {

        callback(false);
    },

    /**
     * 16) 스팟 라이트
     * @param blockInfo
     * @param extraInfo
     * @param data
     * @param callback
     */
    spotLight : function (  extraInfo, data, callback) {

        callback(false);
    }




};


module.exports = judgeChpt3;