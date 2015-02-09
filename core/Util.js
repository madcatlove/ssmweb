/**
 * Created by Lee on 2015-01-23.
 */

var utility = {

    /* String trimming */
    trim : function myTrim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    },

    /* Create data response */
    result : function(data, isError) {
        var s;
        s = {
            data : data,
            error : (isError == true )
        }

        return s;
    },

    /**
     * Create error Object.
     * @param message
     * @param statusCode
     * @returns {Error}
     */
    error : function( message , statusCode, isExternal ) {
        var e = new Error(message);
        e.eType = (isExternal) ? 'external' : 'internal'; // 미들웨어에서 이값이 있으면 json 으로 에러 덤프.
        e.message = message;
        e.status = statusCode || 500;
        return e;
    },


    assert : function( condition, message, errorCode, isExternal ) {


        if( !message ) message = 'Critical Error ! ';

        if( !condition || "undefined" === typeof condition) {
            throw new this.error(message, errorCode , isExternal );
        }
    },

    /* 에러 타입 정의 */
    ETYPE : {
        UNAUTH : genErrorCode(401, ' 접근 권한이 없습니다. '),
        FORBID : genErrorCode(403, ' 잘못된 접근입니다. '),
        CRITICAL : genErrorCode(500, ' 내부 서버 오류 발생 ')
    },

    /* HTML 특수 기호 치환 */
    htmlEntity : function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }


}


function genErrorCode( errorCode, message ) {
    return {
        errorCode : errorCode,
        message : message
    }
}

/* EXPORT */
module.exports = utility;