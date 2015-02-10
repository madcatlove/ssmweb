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
        })
        .done( function(data, statusText, jqXHR ) {
            console.log(' final result => ' , data, typeof(data) );
            if( typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                }
                catch(err) {
                    data = {};
                    console.log(' parse fail ');
                }
            }

            resultCallback(data);
        })
        .fail( function( jqXHR ) {
            var data = {};
            //---------------------------------------
            // HTTP Status Code 에 따른 데이터 덮어쓰기
            //---------------------------------------
            var statusCode = parseInt( jqXHR.status, 10);
            switch( statusCode ) {
                case 401:
                    data.data = ' 사용 권한이 없습니다. ';
                    break;
                case 403:
                    data.data = ' 잘못된 접근입니다. ';
                    break;
                case 500:
                    data.data = ' 내부 서버 오류 (관리자에게 문의하세요.) ';
                    break;
                case 404:
                    data.data = ' 페이지가 없습니다. ';
                    break;
                default:
                    data.data = ' 알 수 없는 오류 입니다. ';
            }
            data.error = true;

            resultCallback( data );
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

//--------------------------------------------------------------
// AJAX LOADING
//--------------------------------------------------------------
$(document).ajaxStart(function() {
    $('#loading').fadeIn('fast');
})
$(document).ajaxStop( function() {
    $('#loading').fadeOut('slow');
})


//--------------------------------------------------------------
// Navigation menu bar active
//--------------------------------------------------------------
$(document).ready( function() {
    var pathName = document.location.pathname;

    var $navMenu = $('ul.nav > li');

    // 모든 li 메뉴 비활성화.
    $navMenu.each( function(idx) {
        if( $(this).hasClass('active') ) {
            $(this).removeClass('active');
        }
    });


    if( /tutorial/i.test(pathName) ) {
        $navMenu.eq(1).addClass('active');
    }
    else if( /freedraw/i.test(pathName) ) {
        $navMenu.eq(2).addClass('active');
    }
    else if( /gallery/i.test(pathName) ) {
        $navMenu.eq(3).addClass('active');
    }
    else {
        $navMenu.eq(0).addClass('active');
    }
})

/**
 * ISO 형태의 데이트를 현재 로케일에 맞게 수정.
 * @param isoDate
 */
function dateNormalize( isoDate ) {
    // 2015-02-10 17:01:06

    if( typeof isoDate === 'undefined' || !isoDate ) {
        return '0000-00-00 00:00';
    }

    var ymd = isoDate.split(' ')[0];
    var hm = (isoDate.split(' ')[1]).split(':');
    delete hm[2];
    hm.length = 2;

    ymd = ymd.replace(/\-/g, '/');
    return [ymd, hm.join(':')].join(' ');
}
