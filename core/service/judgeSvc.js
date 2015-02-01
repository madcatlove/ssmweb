/**
 * Created by jangjunho on 15. 1. 26..
 */

var tutorialDA = require('../dataAccess/tutorialDA');
var bType = require('../BlockType');

var judgeChpt1 = require('./judgeChpt1Svc'),
    judgeChpt2 = require('./judgeChpt2Svc'),
    judgeChpt3 = require('./judgeChpt3Svc');

/**
 * 판정 함수들을 배열 형식으로 리스팅한다. 챕터 1에 3번 문제는 judge[0][2] 이런 식.
 * @type {*[]}
 */
var judge = [
    [judgeChpt1.point, judgeChpt1.line, judgeChpt1.triangle, judgeChpt1.quadangle],
    [judgeChpt2.rect, judgeChpt2.box, judgeChpt2.sphere],
    [judgeChpt3.translate, judgeChpt3.rotate, judgeChpt3.scale, judgeChpt3.pushPop,
        judgeChpt3.perspective, judgeChpt3.orthogonal, judgeChpt3.positionLookat,
        judgeChpt3.dirLight, judgeChpt3.spotLight]
];

var service = {
    /**
     * jid에 따른 튜토리얼 정보를 가져 온 후, 튜토리얼의 챕터 번호와 문제 번호를 인덱스로 하여 판정 함수를 호출한다.
     * @param params
     * @param callback
     */
    execJudge : function(params, callback) {

        tutorialDA.getTutorialInfo(params.jid, function(result) {

            var tutorial = result[0];

            var chptSeq = tutorial.chapterSeq - 1;
            var probSeq = tutorial.problemSeq - 1;

            var blockInfo = tutorial.available_block.split(",");
            blockInfo = blockInfo.map(function (val) { return +val; });

            var extraInfo = JSON.parse(tutorial.extrainfo);

            /**
             * 데이터베이스에 있는 튜토리얼의 블럭 정보의 개수와
             * 넘어온 데이터의 블럭 개수가 일치하는지 확인한다.
             */
            if (params.data.length == blockInfo.length &&
                bType.isRightBlocks(blockInfo, params.data) ) {
                /**
                 * 데이터베이스의 블럭 정보( EX) 1,3,3)
                 * 데이터베이스의 추가 정보(시작점, 시퀀스, 사이즈 등)
                 * 포스트를 통하여 넘어온 데이터 정보
                 * 결과를 반환 해줄 콜백 메서드
                 */
                judge[chptSeq][probSeq](blockInfo, extraInfo, params.data, function(finalResult) {

                    // 결과값이 있다면 기록.
                    if( finalResult ) {
                        tutorialDA.markTutorialSuccess( params.member, params.jid, function( markResult) {
                            callback( finalResult );
                        })
                    } else {
                        callback( finalResult );
                    }
                });
            } else {
                callback(false);
            }
        });

    }

}

module.exports = service;