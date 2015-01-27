/**
 * 튜토리얼 관련 정보를 다루는 서비스
 * @type {utility|exports}
 */
var u = require('../Util');
var tutorialDA = require('../dataAccess/tutorialDA');

var service = {

    /**
     * 특정 TID(튜토리얼아이디) 의 튜토리얼 정보를 가져옴.
     * @param tid
     * @param resultCallback
     */
    getTutorialInfo : function(tid, resultCallback) {
        if(!tid) {
            throw u.error('Invalid TID ', 500);
        }
        tid = parseInt( tid );
        tutorialDA.getTutorialInfo(tid, function(result) {

            var data = result[0];
            if( typeof data != 'undefined'  ) {
                var blockStr = data.available_block.split(',');
                data.available_block = blockStr;
            }
            resultCallback( data );
        });
    },

    /**
     * 튜토리얼 리스트 정보를 모두 정렬하여 가져옴.
     * @param resultCallback
     */
    getTutorialList : function(resultCallback) {
        tutorialDA.getTutorialList(resultCallback);
    },

    /**
     * 특정회원 튜토리얼 성공 기록. ( insertID 를 리턴한다 )
     * @param memberSession
     * @param tid
     * @param resultCallback
     */
    markTutorialSuccess : function(memberSession, tid, resultCallback) {
        u.assert( tid , 'Invalid TID', 500);
        u.assert( memberSession, 'Invalid Member', 403 );
        u.assert( memberSession.seq, 'Invalid Member', 403);

        tutorialDA.markTutorialSuccess( memberSession, tid, function(result) {
            if( result > 0 ) {
                resultCallback( true );
            }
            else {
                resultCallback( false );
            }
        })
    },




}


/* EXPORT */
module.exports = service;