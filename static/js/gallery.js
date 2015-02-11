/**
 * Created by Lee on 2015-02-08.
 */

var galleryBlockData = [];

/**
 * 갤러리 로더.
 * @param page
 */
function galleryLoader(page) {
    urlReq.get('/gallery/info', {page : page || 1}, function(result) {
        if( result.error ) {
            alert(' Critical Error Occur !! ');
            console.log( result );
        }
        else {
            var data = result.data;


            //-------- 포토라마 데이터 생성 ----------------
            var imageUrl = '/static/upload/';
            var $fotorama = $('#fotorama');
            for(var i = 0; i < data.length; i++ ) {
                var item = data[i];
                var img = $('<img />').attr('src', imageUrl + item.fileName).attr('data-blockseq', i);
                $fotorama.append( img );

                galleryBlockData.push( JSON.parse( item.extraInfo ) ); // 블럭 뼈대 데이터 생성.
            }

            /* 포토라마 이벤트 처리 */
            $fotorama.on('fotorama:show', function(e, foto, extra) {
                var currentItem = foto.activeFrame;

                updateBlockRender( currentItem.blockseq );



            })
            $fotorama.fotorama();


        }
    })
}

/**
 * 블락을 복구 / 실제 데이터 주입 / 랜더링 함수 호출
 * @param blockSeq
 */
function updateBlockRender( blockSeq ) {

    var blockTempItem = galleryBlockData[blockSeq];
    //console.log('called updateBlockRender : ', blockSeq, blockTempItem);

    var $stacklist = $('#stacklist'); // 스택 리스트 Division
    var stacklist_width = $stacklist.width();
    var blockStackData = [];

    // 스택 리스트 초기화.
    $stacklist.children().remove();


    //-- 블락 데이터 추가 시작 --
    for(var i = 0; i < blockTempItem.length; i++) {
        var item = blockTempItem[i];
        var nBlock = recoverBlockdata( item, i);
        console.log( 'itemInfo', nBlock , item );

        // 데이터 주입.
        var toShortHTML = nBlock.toShortHTML();
        $stacklist.append( toShortHTML );
        nBlock.injectData( item.data );
        nBlock.initTooltipInfo();
        nBlock.blockQuery.css('width', stacklist_width);
        console.log(' width => ', stacklist_width);
        blockStackData.push( nBlock );
    }
    doRender( blockStackData );

}

/**
 * 블락 껍데기 복구시작. ( blockData 에 blockType 가 포함되어있어야 껍데기복구가능 )
 * @param blockData
 * @param seq
 * @returns {*}
 */
function recoverBlockdata( blockData , seq ) {
    var typeList = FBlock.TYPE;

    for( var key in typeList ) {
        var s = typeList[key];

        if(s.blockType == blockData.blockType ) {
            return new FBlock(s, seq);
        }
    }

    return null;
}


/**
 * 랜더링 시작. ( 블락 스택 리스트 필요 )
 * @param stackList
 */
var doRender = function(stackList) {

    var executableCode = '';
    var drawListCode = ''; // 드로우 함수에 들어갈 코드 리스트.(String)
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
            if( isCanvas.length ) {
                isCanvas.remove();
            }

            if( typeof processingInstance !== 'undefined') {
                processingInstance = undefined;
            }


            /**
             * ontouchstart="touchStart(event);"
             ontouchmove="touchMove(event);"
             ontouchend="touchEnd(event);"
             ontouchcancel="touchCancel(event);"
             * @type {*|jQuery}
             */
            var sCanvas = $('<canvas />').attr('id', 'canvasRender');
            /*sCanvas.attr('ontouchstart', 'touchStart(event);')
                .attr('ontouchmove', 'touchMove(event);')
                .attr('ontouchend', 'touchEnd(event);')
                .attr('ontouchcancel', 'touchCancel(event);');*/

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

            $('#srender').append( sCanvas );

            var p = new Processing( sCanvas.get(0), executableCode );
        })

    })
}


/**
 * --------- 시작 --------
 */
$(document).ready( function() {

    galleryLoader();

})