

$(document).ready( function() {

    var $blockList = $('#blocklist');

    //---- 블락 객체 담고있는 리스트 -----
    var arrBlockList = [];
    var arrStackList = [];


    //----------- 블락 생성 -----------------
    var blockTypeList = Object.keys( FBlock.TYPE );
    for(var i = 0; i < blockTypeList.length; i++) {
        var block = new FBlock( FBlock.TYPE[ blockTypeList[i]], i);
        block.appendHTML( $blockList );
        block.setButtonListen(false); // 버튼 잠금
        arrBlockList.push( block );
    }

    // Drag & Drop 활성화
    initMoveBlock( arrBlockList, arrStackList );


    $(document).on('movedBlock', movedBlockListener);
    $(document).on('removedBlock', removedBlockListener);


    /* 디버깅 버튼 */
    $('#debugStack').click( function() {
        console.log(' stack list ' , arrStackList );
        for(var i = 0; i < arrStackList.length; i++) {
            var item = arrStackList[i];
            console.log( 'stackItem' + i , item.toJSON() );
        }
    })


    $('#canvasRender').bind('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;

        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        }
        else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }

        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });

    $.get('/static/content/freedraw/setup.txt').done( function( plainData ) {

        var $render = $('#canvasRender');
        var $renderParent = $('#srender');

        //console.log( $renderParent.width(), $renderParent.height() );
        plainData = plainData.replace('#_WIDTH_#', $renderParent.width() );
        plainData = plainData.replace('#_HEIGHT_#', $renderParent.height() );


        var p = new Processing( $render.get(0), plainData );
        //  console.log( Processing.compile(plainData).sourceCode   );

    })


});


var movedBlockListener = function(event, stacklist) {
    console.log(' 추가 이벤트 발생 ', stacklist);
}

var removedBlockListener = function(event, stacklist) {
    console.log(' 삭제 이벤트 발생 ', stacklist);
}