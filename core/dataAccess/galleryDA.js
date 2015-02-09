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
                throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
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
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback( conn.insertId );

                conn.release();
            })
        })
    },


    getGalleryInfo : function(sParam, resultCallback) {
        var queryStatement = ' SELECT GI.seq, GI.fileInfo, GI.fileName, GI.regdate, GI.extraInfo, MI.userid FROM galleryInfo GI' +
                             ' LEFT OUTER JOIN memberInfo MI' +
                             ' ON GI.memberSeq = MI.seq' +
                             ' ORDER BY regdate DESC';

        db.getConnection( function(conn) {
            conn.query( queryStatement, function(err, result) {
                if( err ) {
                    console.error(' galleryDA Error ( getGalleryInfo ) ', err);
                    throw u.error(u.ETYPE.CRITICAL.message + ' : ' + err.message , u.ETYPE.CRITICAL.errorCode);
                }

                resultCallback( result );

                conn.release();
            })
        })
    }

}

/* EXPORT */
module.exports = dataAccess;