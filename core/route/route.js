/**
 * Created by madcat on 1/21/15.
 */

var rMain = require('./main'),
    rTutorial = require('./tutorial'),
    rMember = require('./member'),
    rJudge = require('./judge'),
    rBoard = require('./board'),
    rFreedraw = require('./freedraw'),
    rGallery = require('./gallery'),
    errorController = require('../controller/errorCont');

/**
 * 라우팅 정의 파일. ( 세세한 라우팅은 해당 파일이 가지고있다. )
 * @param app
 */
var routeMapper = function(app) {

    app.use('/',  rMain);
    app.use('/tutorial', rTutorial);
    app.use('/member', rMember);
    app.use('/judge', rJudge);
    app.use('/board', rBoard);
    app.use('/freedraw', rFreedraw);
    app.use('/gallery', rGallery);


    // 에러 처리를 위한 미들웨어 & 컨트롤러
    app.use( errorController.pageNotFoundHandler ); // 404 처리
    app.use( errorController.errorHandler ); // 모든 에러 처리

}


//--------------
// EXPORT MODULE
module.exports = routeMapper;

