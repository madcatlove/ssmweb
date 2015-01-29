/**
 * Created by Lee on 2015-01-26.
 */
$(document).ready( function() {

    // 시작하자마자 모달창 띄움.
    $('#tutorialModal').modal({
       backdrop: 'static',
       //keyboard: false,
       show: true,
    });


})

function procJudge( blocks_JSON, tid ) {
    if( typeof blocks_JSON !== 'object') {
        return false;
    }

    var s = JSON.stringify( blocks_JSON );
    var sParam = {
        data : s,
    }

    urlReq.post('/judge/'+tid, sParam, function(result) {

    })
}

function procMoveBoard( tid , page ) {
    window.location.href = '/board/'+tid+'?page='+page;
    return false;
}