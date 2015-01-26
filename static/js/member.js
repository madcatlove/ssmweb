/**
 * Created by madcat on 1/26/15.
 */



var procMemberJoin = function() {

    var userid = $('form#member_join #userid');
    var userpwd = $('form#member_join #userpwd');
    var userpwd2 = $('form#member_join #userpwd2');

    var s_userid = userid.val().trim();
    var s_userpwd = userpwd.val().trim();
    var s_userpwd2 = userpwd.val().trim();

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