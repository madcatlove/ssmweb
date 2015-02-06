/**
 * Created by Lee on 2015-02-07.
 */


var db = require('../mysql');
var u  = require('../Util');
var fs = require('fs');
var path = require('path');

var dataAccess = {

    /**
     * 갤러리 파일 저장 DA ( /static/upload 에 저장된다 )
     * @param galleryData
     * @param filename
     * @param resultCallback
     */
    saveGalleryFile : function(galleryData, filename, resultCallback) {
        var savePath = path.join( __dirname, '../../', 'static/upload');


        fs.writeFile( savePath + '/' + filename, galleryData, function(err) {
            if( err ) {
                console.error(' galleryDA Error (saveGalleryFile) ', err);
                throw u.error(err.message, 500);
            }

            resultCallback( true );
        })
    },

    /**
     * 갤러리 정보 DB 에 기록 , 블락 정보도 같이 기록됨
     * @param sParam
     * @param resultCallback
     */
    insertGallery : function(sParam, resultCallback) {
        var member = sParam.member;

        var queryStatement = ' INSERT INTO galleryInfo (memberSeq, regdate, fileInfo, fileName, extraInfo) VALUES ';
            queryStatement += ' (?, NOW(), ?, ?, ?)';

        db.getConnection( function(conn) {
            conn.query( queryStatement, [member.seq, 'N', sParam.filename, sParam.extraInfo], function(err, result) {
                if( err ) {
                    console.error(' galleryDA Error ( insertGallery ) ', err);
                    throw u.error( err.message, 500 );
                }

                resultCallback( conn.insertId );

                conn.release();
            })
        })
    }

}

/* EXPORT */
module.exports = dataAccess;