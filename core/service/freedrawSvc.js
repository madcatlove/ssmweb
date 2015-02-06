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
        u.assert( sParam.member , ' 잘못된 접근입니다. ', 403);
        u.assert( sParam.slotid , ' 잘못된 접근입니다. ', 403);

        freedrawDA.getSlotInfoBySlotid( sParam, function(result) {
            if( result.length == 0 ) {
                throw u.error(' 데이터가 없습니다 ', 500);
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
        u.assert( sParam.member , ' 잘못된 접근입니다. ', 403);
        u.assert( sParam.slotSeq , ' 잘못된 접근입니다. ', 403);
        u.assert( sParam.data , ' 잘못된 접근입니다. ', 403);


        freedrawDA.updateSlotData( sParam, resultCallback );
    }
}


/* EXPORT */
module.exports = service;