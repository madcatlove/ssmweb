/**
 * Created by Lee on 2015-01-26.
 */
$(document).ready( function() {

    // 시작하자마자 모달창 띄움.
    $('#tutorialModal').modal({
       backdrop: 'static',
       //keyboard: false,
       show: true
    });


})

function procJudge( blocks_JSON, tid ) {
    if( typeof blocks_JSON !== 'object') {
        return false;
    }

    var s = JSON.stringify( blocks_JSON );
    var sParam = {
        data : s
    }

    urlReq.post('/judge/'+tid, sParam, function(result) {

        /* 에러 발생시 */
        if( result.error == true ) {
            var messageData = result.data;

            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DANGER,
                title: '아래사항을 고려해보셨나요?',
                message: function(dialog) {
                    var $content = $('<ol />');

                    for(var i = 0; i < messageData.length; i++) {
                        $content.append( $('<li />').html( messageData[i] ) );
                    }

                    return $content;
                },
                buttons: [
                    {
                        label: ' RETRY ',
                        cssClass: 'btn-warning',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ] /* end button */
            });
        }
        /* 성공시 */
        else {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_SUCCESS,
                title : '축하합니다',
                message : ' 완료 ',
                buttons: [
                    {
                        label: ' NEXT STEP ',
                        cssClass: 'btn-info',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ] /* end button */
            })
        }

    })
}

function procMoveBoard( tid , page ) {
    window.location.href = '/board/'+tid+'?page='+page;
    return false;
}