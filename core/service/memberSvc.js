/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var memberDA = require('../dataAccess/memberDA'),
    freedrawDA = require('../dataAccess/freedrawDA');
var crypto = require('crypto');
var async = require('async');

var service = {

    /* 아이디를 통해 해당 유저 정보 가져옴 */
    getMemberById : function( userid, resultCallback) {
        u.assert( userid, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );
        u.assert( userid.length > 0, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );

        memberDA.getMemberById( userid, resultCallback);
    },

    /* 멤버 추가 */
    insertMember : function( member, resultCallback) {
        u.assert( member.userid || member.userpwd, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode  );
        u.assert( member.userid.length > 0 || member.userpwd.length > 0 , u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );

        var sMember = {
            userid : member.userid,
            userpwd : crypto.createHash('sha512').update( member.userpwd).digest('hex')
        };

        async.waterfall([

            /* 회원 생성 */
            function createMember( _callback) {
                memberDA.insertMember( sMember, function(result) {
                    _callback(null, result);
                })
            },

            /* 슬롯 생성 */
            function initMemberSlot( insertid, _callback) {

                var nextCallback = (function() {
                    var count = 0;
                    return function() {
                        count++;
                        if( count == 5) {
                            _callback(null, insertid);
                        }
                    }
                })();

                for(var i = 1; i <= 5; i++) {
                    (function( slotid) {
                        freedrawDA.initMemberSlot(insertid, slotid, function(result) {
                            nextCallback();
                        })
                    })(i);
                }
            }

        ],
            /* 최종 콜백 실행 */
            function finalExec(err, result) {
                console.log(' execute final callback (memberSVC : insertMember() ) ');
                resultCallback( result );
            }

        )



    },

    /* 멤버 로그인 서비스 */
    procMemberLogin : function( member, resultCallback) {
        u.assert( member.userid || member.userpwd, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );
        u.assert( member.userid.length > 0 || member.userpwd.length > 0, u.ETYPE.FORBID.message, u.ETYPE.FORBID.errorCode );

        var sMember = {
            userid : member.userid,
            userpwd : crypto.createHash('sha512').update( member.userpwd).digest('hex')
        };

        memberDA.getMemberById( sMember.userid, function(result) {

            if( result && result.userpwd == sMember.userpwd) {
                resultCallback( result );
            }
            else {
                resultCallback( false );
            }
        })
    },

    /* 세션에서 사용할 멤버 객체 가공 생성 */
    createMemberSession : function(req, member) {
        var sess = req.session;
        if( !sess) return;

        sess.member = {
            userid : member.userid,
            seq : parseInt(member.seq),
            lastlogin : new Date()
        };
    },

    /* 세션 만료 */
    removeMemberSession : function(req) {
        var sess = req.session;
        if( !sess) return;

        if( sess.hasOwnProperty('member') ) {
            delete sess.member;
        }
    },

    /* 세션 멤버정보와 주어진 멤버 정보가 같은지 ? */
    assertMemberEqual : function(req, member) {
        var sess = req.session;
        if( !sess) return false;
        if( !sess.member) return false;

        if( sess.member.userid != member.userid ) return false;
        if( sess.member.seq != member.seq ) return false;
        return true;
    },

    /* 튜토리얼 가이드 클리어 */
    clearTutorialGuide : function(member, resultCallback) {
        u.assert( member  , u.ETYPE.UNAUTH.message, u.ETYPE.UNAUTH.errorCode);

        memberDA.clearTutorialGuide(member, function(result) {
            resultCallback(result);
        })
    }

}

/* EXPORT */
module.exports = service;