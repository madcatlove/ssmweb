/**
 * Created by Lee on 2015-02-08.
 */

var galleryBlockData = [];

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

            $fotorama.on('fotorama:show', function(e, foto, extra) {
                var currentItem = foto.activeFrame;

                updateBlockRender( currentItem.blockseq );



            })
            $fotorama.fotorama();


        }
    })
}

function updateBlockRender( blockSeq ) {

    var blockTempItem = galleryBlockData[blockSeq];
    console.log('called updateBlockRender : ', blockSeq, blockTempItem);

    var $stacklist = $('#stacklist');
    var blockStackData = [];

    // 스택 리스트 초기화.
    $stacklist.children().remove();


    for(var i = 0; i < blockTempItem.length; i++) {
        var item = blockTempItem[i];
        var nBlock = recoverBlockdata( item, i);
        console.log( 'itemInfo', nBlock , item );

        // 데이터 주입.
        var toShortHTML = nBlock.toShortHTML();
        $stacklist.append( toShortHTML );
        nBlock.injectData( item.data );
        blockStackData.push( nBlock );
    }
    doRender( blockStackData );

}


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

            console.log(' ----- EXEC CODE --------');
            console.log( executableCode );
            console.log(' ----- //EXEC CODE --------');

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

            var p = new Processing( sCanvas.get(0), executableCode );
            console.log(p);

        })

    })
}



$(document).ready( function() {

    galleryLoader();

})