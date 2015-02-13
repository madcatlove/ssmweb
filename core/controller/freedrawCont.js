
var u = require('../Util');
var freedrawService = require('../service/freedrawSvc'),
    galleryService = require('../service/gallerySvc'),
    tutorialService = require('../service/tutorialSvc');

var async = require('async');

var controller = {

    /**
     * Freedraw 뷰 렌더링 컨트롤러
     * @param req
     * @param res
     */
    view : function(req, res) {
        var sess = req.session;
        var opt = {
            extraJS : [
                'freeDraw/processing.js', 'freeDraw/FBlock.js', 'freeDraw/FMoveblock.js', 'freeDraw/freedraw.js',
                'freeDraw/processing_touchevent.js', 'freeDraw/dataLoader.js', 'bootstrap-colorpicker.js'
            ],
            extraCSS : ['freedraw.css', 'bootstrap-colorpicker.css'],
            member : sess.member
        };

        async.waterfall([
            /* 튜토리얼 챕터별 리스트 생성 */
            function makeChapterList( _callback) {
                tutorialService.getTutorialChapterList( function(result) {
                    opt.tutorialChapterList = result;
                    _callback( null );
                })
            },

            /* 접근 가능한 레벨인지 */
                /*
            function validLevelForFreedraw( _callback) {
                tutorialService.getTutorialProgressInfo(sess.member, function(result) {
                    if( typeof result === 'undefined' ) throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);

                    // 접근 가능하지 않다면.
                    for(var key in result) {
                        if( !result[key] ) {
                            throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);
                        }
                    }


                    _callback( null );
                })
            } */

        ],
            /* 최종 실행 콜백 */
            function finalExec(err, result) {
                res.render('freedraw', opt);
            }
        );

    },

    /**
     * Freedraw 뷰 렌더링 컨트롤러 (특정 슬롯)
     * @param req
     * @param res
     */
    viewBySlotid : function(req, res) {
        var sess = req.session;
        var opt = {
            extraJS : [
                'freeDraw/processing.js', 'freeDraw/FBlock.js', 'freeDraw/FMoveblock.js', 'freeDraw/freedraw.js',
                'freeDraw/processing_touchevent.js', 'freeDraw/dataLoader.js', 'bootstrap-colorpicker.js'
            ],
            extraCSS : ['freedraw.css', 'bootstrap-colorpicker.css'],
            member : sess.member
        };

        async.waterfall([
            /* 튜토리얼 챕터별 리스트 생성 */
            function makeChapterList( _callback) {
                tutorialService.getTutorialChapterList( function(result) {
                    opt.tutorialChapterList = result;
                    _callback( null );
                })
            },

            /* 슬롯 데이터 가져옴 */
            function getSlotData( _callback) {
                var sParam = {
                    member : sess.member,
                    slotid : req.slotid
                }
                freedrawService.slotDataBySlotid( sParam, function(result) {
                    console.log(result);
                    opt.slotData = result.data;
                    _callback(null);
                })
            },

            /* 접근 가능한 레벨인지 */
            /*
             function validLevelForFreedraw( _callback) {
             tutorialService.getTutorialProgressInfo(sess.member, function(result) {
             if( typeof result === 'undefined' ) throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);

             // 접근 가능하지 않다면.
             for(var key in result) {
             if( !result[key] ) {
             throw u.error(u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode , true);
             }
             }


             _callback( null );
             })
             } */

        ],
            function finalExec(err, result) {
                res.render('freedraw', opt);
            }
        );

    },

    /**
     * Freedraw 데이터 저장 컨트롤러 ( 갤러리 이미지도 저장 )
     * @param req
     * @param res
     */
    saveData : function(req, res) {
        var sess = req.session;
        var slotData = req.body.data;
        var galleryData = req.body.galleryData;
        var slotSeq = req.slotid;

        u.assert( sess, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sess.member , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( slotData, u.ETYPE.FORBID.message + ' 슬롯 데이터 누락 ', u.ETYPE.FORBID.errorCode);
        u.assert( galleryData , u.ETYPE.FORBID.message + ' 갤러리 데이터 누락 ', u.ETYPE.FORBID.errorCode);


        var sParam = {
            member : sess.member,
            data : slotData,
            slotSeq : slotSeq
        }

        var galleryParam = {
            member : sess.member,
            galleryData : galleryData,
            extraInfo : slotData
        }

        async.series([
            /* 슬롯 업데이트 */
            function updateSlot(_callback) {
                freedrawService.updateSlotData(sParam, function(result) {
                    _callback(null);
                })
            },

            /* 갤러리 저장 */
            function saveGallery(_callback) {
                galleryService.saveGallery(galleryParam, function(result) {
                    _callback(null);
                })
            }
        ],
            /* 최종 실행 콜백 */
            function finalExec(err, result) {
                res.json(u.result(result));
            }
        );

    },

    /**
     * 해당 회원 슬롯 모든 정보를 가져옴.
     * @param req
     * @param res
     */
    getAllSlotInfo : function(req, res) {
        var sess = req.session;
        u.assert( sess, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sess.member , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);

        freedrawService.slotDataByMember( sess.member, function(result) {
            res.json(u.result( result ) );
        })
    },


    /**
     * 해당 회원 특정 슬롯 번호 정보만 가져옴 ( 'slotid' range in 1~5 )
     * @param req
     * @param res
     */
    getSlotInfoBySlotid : function(req, res) {
        var sess = req.session;
        var slotid = parseInt(req.slotid);

        u.assert( sess, u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sess.member , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( slotid > 0, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);

        var sParam = {
            member : sess.member,
            slotid : slotid
        }

        freedrawService.slotDataBySlotid( sParam, function(result) {
            res.json( u.result(result) );
        })
    }
}


/* EXPORT */
module.exports = controller;