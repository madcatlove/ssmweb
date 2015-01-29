/**
 * Created by joom on 2015-01-28.
 */

var blockType = {

    BEGIN : 1,
    END : 2,
    VERTEX_2 : 3,
    VERTEX_3 : 4,
    DRAW_CIRCLE : 5,
    DRAW_BOX : 6,
    DRAW_SPHERE : 7,
    PUSH_MATRIX : 8,
    POP_MATRIX : 9,
    TRANSLATE : 10,
    ROTATE : 11,
    SCALE : 12,
    PERSPECTIVE : 13,
    ORTHOGRAPHIC : 14,
    LOOKAT : 15,
    DIR_LIGHT : 16,
    SPOT_LIGHT : 17,
    CAM_POS : 18,
    LIGHT_POS : 19,

    /**
     * 올바른 블럭 패러미터가 왔는지 확인.
     * @param blockInfo
     * @param paramInfo
     * @returns {boolean}
     */
    isRightBlocks : function (blockInfo, paramInfo) {

        var cntInfos = [];

        for (var i = 0 ; i < 30 ; i ++) cntInfos[i] = 0;
        for (var i = 0 ; i < blockInfo.length ; i ++) {
            cntInfos[parseInt(blockInfo[i])] ++;
        }
        for (var i = 0 ; i < paramInfo.length ; i ++) cntInfos[paramInfo[i].blockType] --;

        for (var i = 0 ; i < cntInfos.length ; i ++) {
            if (cntInfos[i] != 0) {
                return false;
            }
        }

        return true;
    }

};

module.exports = blockType;