/**
 * Created by Lee on 2015-01-23.
 */

var utility = {

    /* String trimming */
    trim : function myTrim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    },

    /* Create data response */
    result : function(data, isError, ErrorMessage) {
        var s;

        if( isError ) {
            s = {
                data : ErrorMessage,
                error : true
            }
        }
        else {
            s = {
                data : data,
                error : false
            }
        }

        return s;
    },

    /**
     * Create error Object.
     * @param message
     * @param statusCode
     * @returns {Error}
     */
    error : function( message , statusCode ) {
        var e = new Error(message);
        e.message = message;
        e.status = statusCode || 500;
        return e;
    },


    assert : function( condition, message, errorCode ) {


        if( !message ) message = 'Critical Error ! ';

        if( !condition || "undefined" === typeof condition) {
            throw new this.error(message, errorCode );
        }
    },



}


/* EXPORT */
module.exports = utility;