/**
 * Created by jangjunho on 15. 1. 26..
 */

var jMath = require('../Math');
var bType = require('../BlockType');

var judgeChpt3 = {

    /**
     * 8) 물체 이동 판정
     * 1. 입력 패러미터 비교 or 매트릭스 계산 후 비교
     * @param data
     * @param callback
     */
    translate : function (blockInfo, extraInfo, data, callback) {
        var res = true;

        var size = extraInfo.size;
        var trans = extraInfo.trans;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.DRAWBOX && data[1].blockType == bType.TRANSLATE) {

            var isProperBox = jMath.isEqualFloat([
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]]);

            var isProperTrans =  jMath.isEqualFloat([
                [data[1].data.x, trans.x],
                [data[1].data.y, trans.y],
                [data[1].data.z, trans.z]]);

            if (!isProperBox || !isProperTrans) {
                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    },

    /**
     * 9)  물체 회전 판정
     * 1. 입력 패러미터 비교 or 매트릭스 계산 후 비교
     * @param data
     * @param callback
     */
    rotate : function (blockInfo, extraInfo, data, callback) {
        var res = true;

        var size = extraInfo.size;
        var rotate = extraInfo.rotate;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.DRAWBOX && data[1].blockType == bType.ROTATE) {

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
    scale : function (blockInfo, extraInfo, data, callback) {
        var res = true;
        var seq = extraInfo.seq;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.SCALE && data[1].blockType == bType.DRAWBOX) {

            var isProperScale =  jMath.isEqualFloat([
                [data[0].data.x, seq[0].info.x],
                [data[0].data.y, seq[0].info.y],
                [data[0].data.z, seq[0].info.z]]);

            var isProperBox = jMath.isEqualFloat([
                [data[1].data.x, seq[1].info.x],
                [data[1].data.y, seq[1].info.y],
                [data[1].data.z, seq[1].info.z],
                [data[1].data.size, seq[1].info.size]]);

            if (!isProperBox || !isProperScale) {
                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    },

    /**
     * 11) 푸시 팝 매트릭스 판정
     * @param data
     * @param callback
     */
    pushPop : function (blockInfo, extraInfo, data, callback) {

    },

    /**
     * 12) 펄스펙티브 카메라 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    perspective : function (blockInfo, extraInfo, data, callback) {
        var res = true;

        var size = extraInfo.size;
        var pers = extraInfo.pers;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.DRAWBOX && data[1].blockType == bType.PERSPECTIVE) {

            var isProperBox = jMath.isEqualFloat([
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]]);

            var isProperPers =  jMath.isEqualFloat([
                [data[1].data.fov, pers.fov],
                [data[1].data.aspect, pers.aspect],
                [data[1].data.near, pers.near],
                [data[1].data.far, pers.far]]);

            if (!isProperBox || !isProperPers) {
                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    },

    /**
     * 13) 오쏘고날 카메라 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    orthogonal : function (blockInfo, extraInfo, data, callback) {
        var res = true;

        var size = extraInfo.size;
        var ortho = extraInfo.ortho;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.DRAWBOX && data[1].blockType == bType.OTHOGRAPHIC) {

            var isProperBox = jMath.isEqualFloat([
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]]);

            var isProperOrtho =  jMath.isEqualFloat([
                    [data[1].data.left, ortho.left],
                    [data[1].data.right, ortho.right],
                    [data[1].data.top, ortho.top],
                    [data[1].data.bot, ortho.bot],
                    [data[1].data.near, ortho.near]
                    [data[1].data.far, ortho.far]]);

            if (!isProperBox || !isProperOrtho) {
                res = false;
            }

        } else {
            res = false;
        }

        callback(res);
    },

    /**
     * 14) 카메라 포지션 / 룩엣 판정
     * 1. 입력 패러미터 비교
     * @param data
     * @param callback
     */
    positionLookat : function (blockInfo, extraInfo, data, callback) {
        var res = true;

        var size = extraInfo.size;
        var pos = extraInfo.campos;

        /**
         * 입력 패러미터 비교 방식
         */
        if (data[0].blockType == bType.DRAWBOX && data[1].blockType == bType.CAMERAPOSITION) {

            var isProperBox = jMath.isEqualFloat([
                [data[0].data.w, size.w],
                [data[0].data.h, size.h],
                [data[0].data.d, size.d]]);

            var isProperPos =  jMath.isEqualFloat([
                [data[1].data.x, pos.x],
                [data[1].data.y, pos.y],
                [data[1].data.z, pos.z]]);

            if (!isProperBox || !isProperPos) {
                res = false;
            }

        } else {
            res = false;
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
    dirLight : function (blockInfo, extraInfo, data, callback) {

        callback(false);
    },

    /**
     * 16) 스팟 라이트
     * @param blockInfo
     * @param extraInfo
     * @param data
     * @param callback
     */
    spotLight : function (blockInfo, extraInfo, data, callback) {

        callback(false);
    }




};


module.exports = judgeChpt3;