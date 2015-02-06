
var u = require('../Util');
var freedrawService = require('../service/freedrawSvc'),
    galleryService = require('../service/gallerySvc');

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
                'freedraw/processing.js', 'freedraw/FBlock.js', 'freedraw/FMoveblock.js', 'freedraw/freedraw.js',
                'freedraw/processing_touchevent.js', 'freedraw/dataLoader.js'
            ],
            extraCSS : ['freedraw.css'],
            member : sess.member
        };
        res.render('freedraw', opt);
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
                'freedraw/processing.js', 'freedraw/FBlock.js', 'freedraw/FMoveblock.js', 'freedraw/freedraw.js',
                'freedraw/processing_touchevent.js', 'freedraw/dataLoader.js'
            ],
            extraCSS : ['freedraw.css'],
            member : sess.member
        };

        async.waterfall([
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
            }

        ],
            function finalExec(err, result) {
                res.render('freedraw', opt);
            }
        )

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

        u.assert( sess, ' 잘못된 접근입니다. ', 403);
        u.assert( sess.member , ' 잘못된 접근입니다. ', 403);
        u.assert( slotData, ' 슬롯 데이터가 없습니다. ', 500);
        u.assert( galleryData , ' 이미지 데이터가 없습니다. ', 500);


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
        u.assert( sess, ' 잘못된 접근입니다. ', 403);
        u.assert( sess.member , ' 잘못된 접근입니다. ', 403);

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

        u.assert( sess, ' 잘못된 접근입니다. ', 403);
        u.assert( sess.member , ' 잘못된 접근입니다. ', 403);
        u.assert( slotid > 0, ' 잘못된 접근입니다. ', 403);

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