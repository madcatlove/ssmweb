/**
 * Created by Lee on 2015-02-06.
 */


var u = require('../Util');
var freedrawDA = require('../dataAccess/freedrawDA');
var crypto = require('crypto');
var async = require('async');

var service =  {

    /**
     * 해당 회원에 대한 FreeBlock Slot 를 모두 가져옴
     * @param member
     * @param resultCallback
     */
    slotDataByMember : function(member, resultCallback) {
        u.assert( member, ' 잘못된 접근입니다. ', 403 );

        freedrawDA.getSlotInfoByMember( member, function(result) {
            var items = [];

            // 데이터 존재유무 가공.
            for(var i = 0; i < result.length; i++) {
                var item = result[i];
                if( item.data == 'N' || item.data.length < 5 ) {
                    item.data = null;
                }
                items.push( item );
            }

            resultCallback( items );
        })

    },

    /**
     * 슬롯 id 로 데이터 요청
     * @param sParam
     * @param resultCallback
     */
    slotDataBySlotid : function(sParam, resultCallback) {
        u.assert( sParam.member , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sParam.slotid , u.ETYPE.FORBID.message + ' 슬롯번호 누락 ', u.ETYPE.FORBID.errorCode);

        freedrawDA.getSlotInfoBySlotid( sParam, function(result) {
            if( result.length == 0 ) {
                throw u.error(u.ETYPE.CRITICAL.message + ' :  데이터 누락 ', u.ETYPE.CRITICAL.errorCode);
            }

            var item = result[0];
            if( item.data == 'N' || item.data.length < 5 ) {
                item.data = null;
            }

            resultCallback( item );
        })
    },

    /**
     * 슬롯 데이터 업데이트 서비스
     * @param sParam
     * @param resultCallback
     */
    updateSlotData : function(sParam, resultCallback) {
        u.assert( sParam.member , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sParam.slotSeq , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        u.assert( sParam.data , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);


        freedrawDA.updateSlotData( sParam, resultCallback );
    }
}


/* EXPORT */
module.exports = service;