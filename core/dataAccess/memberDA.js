/**
 * Created by Lee on 2015-01-23.
 */

var db = require('../mysql');
var u  = require('../Util');

var dataAccess = {

    getMemberById : function( userid, resultCallback) {

        var queryStatement = 'SELECT * FROM memberInfo WHERE userid = ?';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [userid], function(err, result) {
                if( err ) {
                    throw u.error(err.message, 500);
                }
                resultCallback( result[0] );
                conn.release();
            })
        })
    },

    insertMember : function( member, resultCallback) {
        var queryStatement = 'INSERT INTO memberInfo (userid, userpwd, regdate) VALUES (?,?, NOW())';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [ member.userid, member.userpwd ], function(err, result) {
                if( err ) {
                    throw u.error( err.message, 500);
                }
                resultCallback( result.insertId );
                conn.release();
            })
        })
    }


};

/* EXPORT */
module.exports = dataAccess;