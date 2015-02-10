/**
 * Created by Lee on 2015-02-06.
 */
var db = require('../mysql');
var u  = require('../Util');

var dataAccess = {

    /**
     * 해당 회원에 대한 FreeBlock Slot 를 모두 가져옴 ( slotSeq 로 오름차순 정렬 )
     * @param member
     * @param resultCallback
     */
    getSlotInfoByMember : function( member , resultCallback) {

        var queryStatement = "SELECT *, CONVERT_TZ(regdate, '+00:00', '+09:00') `cregdate` FROM freeBlock WHERE memberSeq = ? ORDER BY slotSeq ASC";

        db.getConnection( function(conn) {
            conn.query( queryStatement, [member.seq], function(err, result) {
                if( err) {
                    console.error(' freedrawDA Error ( getSlotInfoByMember )  ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }
                resultCallback( result );

                conn.release();
            })
        })

    },

    /**
     * 해당 회원의 특정 슬롯번호의 데이터를 가져옴. ( sParam 은 member 와 slotid 를 무조건 담고있어야한다 )
     * @param sParam
     * @param resultCallback
     */
    getSlotInfoBySlotid : function( sParam, resultCallback) {
        var queryStatement = "SELECT *, CONVERT_TZ(regdate, '+00:00', '+09:00') `cregdate` FROM freeBlock WHERE memberSeq = ? AND slotSeq = ?";

        var member = sParam.member;
        var slotid = sParam.slotid;

        db.getConnection( function(conn) {
            conn.query( queryStatement, [member.seq, slotid], function(err, result) {
                if( err ) {
                    console.error(' freedrawDA Error ( getSlotInfoBySlotid )  ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback(result);

                conn.release();
            })
        })
    },

    /**
     * 슬롯 데이터 업데이트.
     * @param sParam
     * @param resultCallback
     */
    updateSlotData : function(sParam, resultCallback) {
        var member = sParam.member;
        var queryStatement = 'UPDATE freeBlock SET data = ? , regdate = NOW() WHERE memberSeq = ? AND slotSeq = ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [sParam.data, member.seq, sParam.slotSeq], function(err, result) {
                if( err ) {
                    console.error(' freedrawDA Error ( updateSlotData )  ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback( conn.affectedRows );

                conn.release();
            })
        })
    },

    /**
     * 회원 슬롯 할당.
     * @param member
     * @param slotid
     * @param resultCallback
     */
    initMemberSlot : function(memberSeq, slotid,  resultCallback) {
        var queryStatement  = ' INSERT IGNORE INTO freeBlock (memberSeq, data, regdate, slotSeq) VALUES ';
            queryStatement += ' (?, ?, ?, ?); ';

        db.getConnection( function(conn) {
            conn.query(queryStatement, [memberSeq, 'N', '0000-00-00', slotid], function(err, result) {
                if( err ) {
                    console.error(' freedrawDA Error ( initMemberSlot )  ', err );
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback( conn.insertId );

                conn.release();
            })
        })
    }

}

/* EXPORT */
module.exports = dataAccess;