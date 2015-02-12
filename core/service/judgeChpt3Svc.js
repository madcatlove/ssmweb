/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');
var jUtils = require('../jUtils');

var judgeChpt3 = {

    /**
     * 8) Translate
     * 1. 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    translate : function (  extraInfo, data, callback) {

        var messages = [];

        var seq = extraInfo.seq;

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
     * 9) Rotate
     * 1. 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    rotate : function (  extraInfo, data, callback) {


        var messages = [];

        var seq = extraInfo.seq;

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

            } else if (data[i].blockType == jUtils.ROTATE) {

                cmpVals.push([seq[i].info.t, data[i].data.t]);
                cmpVals.push([seq[i].info.x, data[i].data.x]);
                cmpVals.push([seq[i].info.y, data[i].data.y]);
                cmpVals.push([seq[i].info.z, data[i].data.z]);

            } else if (data[i].blockType == jUtils.IDENTITYMATRIX) {

                continue

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 10) Scale
     * 1. 패러미터 비교
     * @param extraInfo
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
     * 11) Push, Pop
     * 1. 패러미터 비교
     * @param extraInfo
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
     * 12) Perspective
     * 1. 입력 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    perspective : function (  extraInfo, data, callback) {

        var messages = [];

        var obj = extraInfo.objs[0];
        var pers = extraInfo.pers;

        for (var i = 0 ; i < data.length ; i ++) {

            var cmpVals = [];

            if (data[i].blockType == 6) {

                cmpVals.push([data[i].data.x, obj.x]);
                cmpVals.push([data[i].data.y, obj.y]);
                cmpVals.push([data[i].data.z, obj.z]);
                cmpVals.push([data[i].data.size, obj.size]);

            } else if(data[i].blockType == 13) {

                cmpVals.push([data[i].data.fov, pers.fov]);
                cmpVals.push([data[i].data.near, pers.near]);
                cmpVals.push([data[i].data.far, pers.far]);

            } else {

                messages.push(jUtils.MSG_WRONG_BLOCK_TYPE);
                break;

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 13) Orthogonal
     * 1. 입력 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    orthogonal : function (  extraInfo, data, callback) {

        var messages = [];

        var obj = extraInfo.objs[0];
        var ortho = extraInfo.ortho;

        for (var i = 0 ; i < data.length ; i ++) {

            var cmpVals = [];

            if (data[i].blockType == 6) {

                cmpVals.push([data[i].data.x, obj.x]);
                cmpVals.push([data[i].data.y, obj.y]);
                cmpVals.push([data[i].data.z, obj.z]);
                cmpVals.push([data[i].data.size, obj.size]);

            }  else if(data[i].blockType == 14) {

                cmpVals.push([data[i].data.left, ortho.left]);
                cmpVals.push([data[i].data.right, ortho.right]);
                cmpVals.push([data[i].data.top, ortho.top]);
                cmpVals.push([data[i].data.bottom, ortho.bottom]);
                cmpVals.push([data[i].data.near, ortho.near]);
                cmpVals.push([data[i].data.far, ortho.far]);

            } else {

                messages.push(jUtils.MSG_WRONG_BLOCK_TYPE);
                break;

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 14) CamPos & LookAt
     * 1. 입력 패러미터 비교
     * @param extraInfo
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

                        objs.splice(j,1);
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
                    callback(messages);
                    return;

                }

            }

        }

        if (objs.length != 0) {

            messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);

        }

        callback(messages);

    },

    /**
     * 15) Directional Light
     * 1. 입력 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */

    dirLight : function (  extraInfo, data, callback) {

        var messages = [];

        var dirLight = extraInfo.dirLight;
        var lightPos = extraInfo.lightPos;
        var lightDir = extraInfo.lightDir;

        for (var i = 0 ; i < data.length ; i ++) {

            var cmpVals = [];

            if (data[i].blockType == jUtils.DIRECTIONALLIGHT) {

                cmpVals.push([data[i].data.hex, dirLight.hex]);

            } else {

                var target;

                if (data[i].blockType == jUtils.LIGHTPOSITION) {

                    target = lightPos;

                } else if (data[i].blockType == jUtils.LIGHTDIRECTION) {

                    target = lightDir;

                }

                cmpVals.push([data[i].data.x, target.x]);
                cmpVals.push([data[i].data.y, target.y]);
                cmpVals.push([data[i].data.z, target.z]);

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    },

    /**
     * 16) Spot Light
     * 1. 입력 패러미터 비교
     * @param extraInfo
     * @param data
     * @param callback
     */
    spotLight : function (  extraInfo, data, callback) {

        var messages = [];

        var spotLight = extraInfo.spotLight;
        var lightPos = extraInfo.lightPos;
        var lightDir = extraInfo.lightDir;

        console.log("datainput",data[0]);
        console.log('extrainfo /' + extraInfo.spotLight);

        for (var i = 0 ; i < data.length ; i ++) {

            var cmpVals = [];

            if (data[i].blockType == jUtils.SPOTLIGHT) {

                cmpVals.push([data[i].data.hex, spotLight.hex]);
                cmpVals.push([data[i].data.intensity, spotLight.intensity]);
                cmpVals.push([data[i].data.angle, spotLight.angle]);
                cmpVals.push([data[i].data.exp, spotLight.exp]);

            } else {

                var target;

                if (data[i].blockType == jUtils.LIGHTPOSITION) {

                    target = lightPos;

                } else if (data[i].blockType == jUtils.LIGHTDIRECTION) {

                    target = lightDir;

                }

                cmpVals.push([data[i].data.x, target.x]);
                cmpVals.push([data[i].data.y, target.y]);
                cmpVals.push([data[i].data.z, target.z]);

            }

            if (!jMath.isEqualFloat(cmpVals)) {

                messages.push(jUtils.MSG_WRONG_BLOCK_PARAMS);
                break;

            }

        }

        callback(messages);

    }

};


module.exports = judgeChpt3;