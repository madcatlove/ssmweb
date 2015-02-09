/**
 * Created by Lee on 2015-02-07.
 */

var u = require('../Util');
var galleryDA = require('../dataAccess/galleryDA');
var crypto = require('crypto');
var async = require('async');

var service = {
    /**
     * 갤러리 저장 서비스
     * @param sParam
     * @param resultCallback
     */
    saveGallery : function( sParam, resultCallback) {
        var member = sParam.member;
        var galleryData = sParam.galleryData;

        u.assert( member,  u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( galleryData , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        u.assert( sParam.extraInfo, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );


        async.waterfall([

            /* 갤러리 데이터 분리 */
            function decodeBase64GalleryData( _callback) {
                var sp = galleryData.split('base64,');
                sp = sp[1];

                var decodedBuff = new Buffer(sp, 'base64');
                _callback(null, decodedBuff);
            },

            /* 파일 저장 */
            function saveFile( decodedBuff, _callback) {
                var filename = crypto.createHash('md5').update( (new Date()).toString() + '-' + Math.random()).digest('hex');
                    filename += '.png';

                galleryDA.saveGalleryFile( decodedBuff, filename, function(result) {
                    _callback(null, filename);
                })
            },

            /* DB 에 저장 */
            function insertGalleryRecord( filename, _callback) {
                var tParam = {
                    member : member,
                    filename : filename,
                    extraInfo : sParam.extraInfo
                }
                galleryDA.insertGallery( tParam, function(result) {
                    _callback(null, result);
                })
            }

        ],
            /* 최종실행 콜백*/
            function finalExec(err, result) {
                resultCallback(result);
            }
        )
    },


    getGallery : function(sParam, resultCallback) {
        galleryDA.getGalleryInfo(null, function(result){
            resultCallback(result);
        });
    }

}

/* EXPORT */
module.exports = service;