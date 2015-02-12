/**
 * Created by madcat on 1/26/15.
 */

/**
 * Member Join
 * @returns {boolean}
 */
function procMemberJoin() {

    var userid = $('form#member_join #userid');
    var userpwd = $('form#member_join #userpwd');
    var userpwd2 = $('form#member_join #userpwd2');

    var s_userid = userid.val().trim();
    var s_userpwd = userpwd.val().trim();
    var s_userpwd2 = userpwd2.val().trim();

    if( s_userid.length == 0 || s_userpwd.length == 0 || s_userpwd2 == 0) {
        alert(' 모두 입력하셔야 합니다. ');
        return false;
    }

    if( s_userpwd != s_userpwd2 ) {
        alert(' 비밀번호는 동일해야 합니다. ');
        userpwd.val('');
        userpwd2.val('');
        userpwd.focus();
        return false;
    }

    var sParam = {
        userid : s_userid,
        userpwd : s_userpwd,
        userpwd2 : s_userpwd2
    }

    urlReq.post('/member/join', sParam, function(result) {
        console.log( result );
        if( result.error ) {
            alert( result.data );
            return false;
        }
        else {
            alert(' 회원가입이 정상적으로 완료되었습니다. ');
            window.location.href = '/';
            return false;
        }
    })

}

/**
 * Member Login
 * @returns {boolean}
 */
function procMemberLogin() {

    var $wLogin = $('#loginModal');

    var userid = $wLogin.find('input').eq(0).val().trim();
    var userpwd = $wLogin.find('input').eq(1).val().trim();

    if( userid.length == 0 || userpwd.length == 0) {
        alert(' 모든 항목을 입력하셔야 합니다. ');
        return false;
    }

    var sParam = {
        userid : userid,
        userpwd : userpwd
    }

    urlReq.post('/member/login', sParam, function(result) {
        if( result.error ) {
            alert( result.data );
            return false;
        }
        alert(' 반갑습니다. ');
        $wLogin.hide();
        window.location.reload();

    })


}

function procMemberLogout() {
    var pathName = document.location.pathname;


    urlReq.get('/member/logout', {}, function(result) {
        if( !result.error) {
            alert(' 정상적으로 로그아웃 되었습니다. ');

            if( /(tutorial|freedraw)/i.test(pathName) ) {
                window.location.href = '/';
            }
            else {
                window.location.reload();
            }
        }
    })

}

function moveMemberJoin() {
    window.location.href = '/member/join';
}