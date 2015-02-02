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

        BootstrapDialog.show({
            type : BootstrapDialog.TYPE_DANGER,
            title : '아래사항을 고려해보셨나요?',
            message : ' -_-; 123123213213213213 ',
            buttons: [
                {
                    label: ' RETRY ',
                    cssClass: 'btn-warning',
                    action : function(dialog) {
                        dialog.close();
                    }
                }
            ] /* end button */
        })

    })
}

function procMoveBoard( tid , page ) {
    window.location.href = '/board/'+tid+'?page='+page;
    return false;
}