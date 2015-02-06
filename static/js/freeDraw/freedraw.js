

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


});


var movedBlockListener = function(event, stacklist) {
    console.log(' 추가 이벤트 발생 ', stacklist);
    doRender(stacklist.data);
}

var removedBlockListener = function(event, stacklist) {
    console.log(' 삭제 이벤트 발생 ', stacklist);
    doRender(stacklist.data);
}

var doRender = function(stackList) {

    var executableCode = '';
    var drawListCode = ''; // 드로우 함수에 들어갈 코드 리스트.(String)
    var $render = $('#canvasRender');
    var $renderParent = $('#srender');


    if( stackList ) {
        for(var i = 0; i < stackList.length; i++) {
            var item = stackList[i];
            drawListCode += item.getProcessingCode();
        }
    }



    /* 셋업 파일 불러옴 */
    $.get('/static/content/freedraw/setup.txt', {data: Math.random()} ).done( function( setupData ) {

        /* 드로우 함수 내부 구현 불러옴 */
        $.get('/static/content/freedraw/draw.txt', {data: Math.random()}).done( function( drawData) {

            // 셋업 데이터 치환
            setupData = setupData.replace( /#_WIDTH_#/gi, $renderParent.width() );
            setupData = setupData.replace( /#_HEIGHT_#/gi, $renderParent.height() );
            executableCode = setupData;

            // 드로우 시작.
            executableCode += 'void draw() { ';
            executableCode += drawData; // 초기설정 데이터.
            executableCode += drawListCode; // 사용자 리스트
            executableCode += '}';

            //console.log( executableCode );

            //console.log( executableCode );

            var isCanvas = $('#srender canvas');
            if( isCanvas.length ) {
                isCanvas.remove();
            }


            /**
             * ontouchstart="touchStart(event);"
             ontouchmove="touchMove(event);"
             ontouchend="touchEnd(event);"
             ontouchcancel="touchCancel(event);"
             * @type {*|jQuery}
             */
            var sCanvas = $('<canvas />').attr('id', 'canvasRender');
                sCanvas.attr('ontouchstart', 'touchStart(event);')
                    .attr('ontouchmove', 'touchMove(event);')
                    .attr('ontouchend', 'touchEnd(event);')
                    .attr('ontouchcancel', 'touchCancel(event);');
            $('#srender').append( sCanvas );
            wheelEventLocker();

            var p = new Processing( sCanvas.get(0), executableCode );

        })


        //console.log( $renderParent.width(), $renderParent.height() );
        //  console.log( Processing.compile(plainData).sourceCode   );

    })
}


var wheelEventLocker = function() {
    $('#canvasRender').bind('mousewheel DOMMouseScroll', function (e) {
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

    /*$('#canvasRender').bind('touchstart touchmove', function(e) {
        alert( $(this) );
    })*/


}




//----------------------------------
// PROCESSING EVENT
