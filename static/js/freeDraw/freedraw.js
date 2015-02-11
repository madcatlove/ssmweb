
//---- 블락 객체 담고있는 리스트 -----
var arrBlockList = [];
var arrStackList = [];

$(document).ready( function() {

    var $blockList = $('#blocklist');

    // stack top , stack bottom 높이 조정
    var $stackTopImg = $('#stacklist_top');
    var $stackBotImg = $('#stacklist_bottom');

    var stackTopWidth = $stackTopImg.width() * 0.9;
    var stackBotWidth = $stackBotImg.width() * 0.9;

    $stackTopImg.css({
        height : ((136.0/460.0) * stackTopWidth) + 'px'
    });
    $stackBotImg.css({
        height : ((64.0/460.0) * stackBotWidth) + 'px'
    })



    //----------- 블락 생성 -----------------
    var blockTypeList = Object.keys( FBlock.TYPE );
    for(var i = 0; i < blockTypeList.length; i++) {
        var block = new FBlock( FBlock.TYPE[ blockTypeList[i]], i);
        block.appendHTML( $blockList );
        block.setButtonListen(false); // 버튼 잠금
        arrBlockList.push( block );
    }

    var blockListHeight = $blockList.height();
    console.log('blockheight',blockListHeight);
    $('#stacklist').height( blockListHeight );

    // Drag & Drop 활성화
    initMoveBlock( arrBlockList, arrStackList , blockListHeight );

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



    /* 셋업 파일 불러옴 */
    $.get('/static/content/freedraw/setup.txt', {data: Math.random()} ).done( function( setupData ) {

        /* 드로우 함수 내부 구현 불러옴 */
        $.get('/static/content/freedraw/draw.txt', {data: Math.random()}).done( function( drawData) {

            // 사용자 데이터 작성
            if( stackList ) {
                drawListCode += drawData;
                for(var i = 0; i < stackList.length; i++) {
                    var item = stackList[i];
                    if( item.blockType == FBlock.TYPE.PERSPECTIVE.blockType  ||
                        item.blockType == FBlock.TYPE.ORTHOGRAPHIC.blockType ||
                        item.blockType == FBlock.TYPE.LOOKAT.blockType ) {
                        drawListCode = item.getProcessingCode() + drawListCode;
                    } else {
                        drawListCode += item.getProcessingCode();
                    }
                }
            }



            // 셋업 데이터 치환
            setupData = setupData.replace( /#_WIDTH_#/gi, $renderParent.width() );
            setupData = setupData.replace( /#_HEIGHT_#/gi, $renderParent.height() );
            executableCode = setupData;

            // 드로우 시작.
            executableCode += 'void draw() { ';
            executableCode += drawListCode; // 사용자 리스트
            executableCode += '}';

            //console.log(' ----- EXEC CODE --------');
            //console.log( executableCode );
            //console.log(' ----- //EXEC CODE --------');

            var isCanvas = $('#srender canvas');

            if( typeof processingInstance !== 'undefined') {
                processingInstance = undefined;
            }

            if( isCanvas.length ) {
                isCanvas.remove();
            }

            wheelEventLocker();
            var sCanvas = $('<canvas />').attr('id', 'canvasRender');
                /*sCanvas.attr('ontouchstart', 'touchStart(event);')
                .attr('ontouchmove', 'touchMove(event);')
                .attr('ontouchend', 'touchEnd(event);')
                .attr('ontouchcancel', 'touchCancel(event);'); */

            $('#srender').append( sCanvas );

            sCanvas.bind('touchstart', function(e) {
                touchStart(e.originalEvent);
            });
            sCanvas.bind('touchmove', function(e) {
                touchMove(e.originalEvent);
            });
            sCanvas.bind('touchend', function(e) {
                touchEnd(e.originalEvent);
            });
            sCanvas.bind('touchcancel', function(e) {
                touchCancel(e.originalEvent);
            });


            var p = new Processing( sCanvas.get(0), executableCode );

        })

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
