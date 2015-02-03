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
            if( statusCode >= 400 && statusCode < 500 ) {
                data = {
                    error: true,
                    data: data.data || '사용권한이 없습니다'
                }
            }
            else if( statusCode >= 500 && statusCode <= 550) {
                data = {
                    error : true,
                    data: data.data || '내부서버 오류 발생'
                }
            }

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
    else {
        $navMenu.eq(0).addClass('active');
    }
})