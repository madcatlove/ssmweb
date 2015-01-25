/**
 * Created by Lee on 2015-01-23.
 */

/**
 * urlReq function
 */
var urlReq = (function() {
    var sAjax = function(url, method, data, resultCallback) {
        console.log(url, method, data)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            type: method,
            data: data
        }).done( function(data) {
            console.log(' final result => ' , data, typeof(data) )
            if( typeof data === 'string')
                data = JSON.parse(data);

            resultCallback(data);
        })
    }


    return {
        get : function(url, data, resultCallback) {
            sAjax(url, 'GET', data, resultCallback);
        },

        post : function(url, data, resultCallback) {
            sAjax(url, 'POST', data, resultCallback);
        },

        put : function(url, data, resultCallback) {
            sAjax(url, 'PUT', data, resultCallback);
        },

        delete : function(url, data, resultCallback) {
            sAjax(url, 'DELETE', data, resultCallback);
        }

    }
})();


//--------------------------------------------------------------
// 로그인 처리 부분
//--------------------------------------------------------------

$(document).ready( function() {
   console.log( $('#loginModal') );
   $('#loginModal').on('show.bs.modal', function() {
       // 모달창 내부 모든 인풋 초기화.
       $('#loginModal').find('input').each( function() {
           $(this).val('');
       })
   });
});

var procMemberLogin = function() {

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
        alert( result.data );

    })


};