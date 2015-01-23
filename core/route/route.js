/**
 * Created by madcat on 1/21/15.
 */

var rMain = require('./main');

/**
 * 라우팅 정의 파일. ( 세세한 라우팅은 해당 파일이 가지고있다. )
 * @param app
 */
var routeMapper = function(app) {

    app.use('/',  rMain);



}


//--------------
// EXPORT MODULE
module.exports = routeMapper;

