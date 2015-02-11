/**
 * 에러처리 미들웨어 컨트롤러
 * @type {{errorHandler: Function}}
 */

var u = require('../Util');
var app = require('express')();

var controller = {

    /**
     * 404 에러 처리를 위한 미들웨어
     * @param req
     * @param res
     * @param next
     */
    pageNotFoundHandler : function(req, res, next) {

        var oURL = req.originalUrl;
        var err = u.error(' Page Not Found for ' + oURL, 404, true);

        next(err);
    },


    /**
     * 모든 에러 처리를 위한 미들웨어
     * @param err
     * @param req
     * @param res
     * @param next
     */
    errorHandler : function(err, req, res, next) {

        if( err && err.hasOwnProperty('status') && err.status != 404) {
            console.error(' //----- ERROR HANDLER ------// ');
            console.error(err);
            console.error(err.stack);
        }

        if( !err.hasOwnProperty('status') || typeof err.status === 'undefined' ) {
            err.status = 500;
        }
        if( !err.hasOwnProperty('message') || typeof err.message === 'undefined') {
            err.message = ' 내부서버 오류 ';
        }

        res.status(err.status);

        /* 에러에 eType 가 있고 internal 값을 가지고있으면 JSON 으로 렌더링 */
        if( err.hasOwnProperty('eType') && err.eType == 'internal' ) {
            res.json( u.result(err.message, true) );
        }
        /* 아니라면 에러 view 페이지로 렌더링 */
        else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    }

}


/* EXPORT */
module.exports = controller;