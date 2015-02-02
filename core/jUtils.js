/**
 * Created by joom on 2015-01-28.
 */

var blockType = {

    BEGIN:1,
    END:2,
    VERTEX2:3,
    VERTEX3:4,
    DRAWCIRCLE:5,
    DRAWBOX:6,
    DRAWSPHERE:7,
    PUSHMATRIX:8,
    POPMATRIX:9,
    TRANSLATE:10,
    ROTATE:11,
    SCALE:12,
    PERSPECTIVE:13,
    OTHOGRAPHIC:14,
    LOOKAT:15,
    DIRECTIONALLIGHT:16,
    SPOTLIGHT:17,
    CAMERAPOSITION:18,
    LIGHTPOSITION:19,
    IDENTITYMATRIX:20,
    LIGHTDIRECTION:21,

    MSG_LACK_BLOCKS : '전달받은 블록의 수 가 부족합니다',

    MSG_WRONG_BLOCK_TYPE : '올바르지 않은 블럭 타입입니다',
    MSG_WRONG_BLOCK_PARAMS : '블럭의 입력이 옳지 않습니다',
    MSG_WRONG_BLOCK_SEQ : '블럭의 순서가 올바르지 않습니다',

    MSG_CHK_START_POINT : '시작 점을 확인 해주세요',


    /**
     * 올바른 블럭 패러미터가 왔는지 확인.
     * @param blockInfo
     * @param paramInfo
     * @returns {boolean}
     */
    isRightBlocks : function (  paramInfo) {

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