/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var memberService = require('../service/memberSvc');

var controller = {

    /**
     * 회원가입 처리 컨트롤러
     * Request param : s_userid, s_userpwd, s_userpwd2
     */
    procJoin : function(req, res) {
        var s_userid = u.trim(req.body.userid);
        var s_userpwd = u.trim(req.body.userpwd);
        var s_userpwd2 = u.trim(req.body.userpwd2);

        u.assert( s_userid.length > 0 , null);
        u.assert( s_userpwd > 0 && s_userpwd == s_userpwd2, null);



    },

    /**
     * 회원가입 뷰 컨트롤러.
     * @param req
     * @param res
     */
    renderJoin : function(req, res) {

    },

    /* 회원로그인 처리 컨트롤러 */
    procLogin : function(req, res) {

        console.log(req.body);

        var s_userid = u.trim( req.body.userid);
        var s_userpwd = u.trim( req.body.userpwd);

        console.log( 'sfsdf ' );


        u.assert( s_userid.length > 0 );
        u.assert( s_userpwd.length > 0 );

        var sParam = {
            userid : s_userid,
            userpwd : s_userpwd
        }

        memberService.procMemberLogin(sParam, function(result) {
            var r;
            if( result ) { // 로그인 성공시.
                r = u.result(true, false);
                memberService.createMemberSession(req, result);
            }
            else { // 로그인 실패시
                r = u.result(false, true, '로그인 실패');
            }

            res.json( r );
        })

    },

    /* 회원로그아웃 컨트롤러 */
    procLogout : function(req, res) {

    },
}

/* EXPORT */
module.exports = controller;