/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var memberService = require('../service/memberSvc'),
    tutorialService = require('../service/tutorialSvc');
var async = require('async');

var controller = {

    /**
     * 회원가입 처리 컨트롤러
     * Request param : s_userid, s_userpwd, s_userpwd2
     */
    procJoin : function(req, res) {
        var s_userid = u.trim(req.body.userid);
        var s_userpwd = u.trim(req.body.userpwd);
        var s_userpwd2 = u.trim(req.body.userpwd2);

        u.assert( s_userid.length > 0 , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        u.assert( s_userpwd.length > 0 && s_userpwd == s_userpwd2, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);

        // 아이디에 불필요한 문자가 들어가있는지?
        var idRegex = /<(.|\n)*?>/gi;
        if( idRegex.test(s_userid) ) {
            throw u.error( u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        }

        var member = {
            userid: s_userid,
            userpwd : s_userpwd
        }

        /* 이미 있는 회원인지 검사 */
        memberService.getMemberById( member.userid, function(result) {

            if( result ) {
                res.json(u.result('이미 존재하는 회원', true));
                return;
            }

            /* 가입 절차 진행 */
            memberService.insertMember(member, function(fresult) {
                res.json( fresult );
            })
        })


    },

    /**
     * 회원가입 뷰 컨트롤러.
     * @param req
     * @param res
     */
    renderJoin : function(req, res) {

        var memberSession = req.session.member;
        var opt = {
            extraJS : [],
            member : memberSession
        }


        async.parallel({

                /* 튜토리얼 챕터 리스트 가져옴 */
                tutorialChapterList: function (_callback) {
                    tutorialService.getTutorialChapterList(function (result) {
                        _callback(null, result);
                    })
                }
            },

                /* 최종 콜백 */
                function finalExec(err, result) {

                    for( var o in result ) {
                        opt[o] = result[o];
                    }

                    res.render('member_join', opt);
                }
        )


    },

    /* 회원로그인 처리 컨트롤러 */
    procLogin : function(req, res) {

        console.log(req.body);

        var s_userid = u.trim( req.body.userid);
        var s_userpwd = u.trim( req.body.userpwd);


        u.assert( s_userid.length > 0 , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        u.assert( s_userpwd.length > 0 , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);

        // 아이디에 불필요한 문자가 들어가있는지?
        var idRegex = /<(.|\n)*?>/gi;
        if( idRegex.test(s_userid) ) {
            throw u.error( u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode);
        }


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
                r = u.result('로그인 실패', true);
            }

            res.json( r );
        })

    },

    /* 회원로그아웃 컨트롤러 */
    procLogout : function(req, res) {
        memberService.removeMemberSession(req);
        res.json( u.result(true, false) );
    },

    /* 튜토리얼 가이드 클리어 */
    clearTutorialGuide : function(req, res) {
        var sess = req.session;

        u.assert( sess  , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);
        u.assert( sess.member ,u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);

        memberService.clearTutorialGuide( sess.member, function(result) {
            res.json(u.result(result) );
        })

    }
}

/* EXPORT */
module.exports = controller;