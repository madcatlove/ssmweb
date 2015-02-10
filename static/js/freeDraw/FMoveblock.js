/**
 * Moveblock 초기화 함수
 * @param blockList
 * @param stackList
 * @param initStacklistHeight
 */
function initMoveBlock( blockList, stackList, initStacklistHeight ) {

    var $blocklist = $('#blocklist'),
        $stacklist = $('#stacklist');

    // 블락들 드래그 가능하게함.
    $('div.blockitem', $blocklist).draggable({
        revert: "invalid",
        containment: "document",
        helper: "clone",
        cursor: "move"
    });

    // 스택에 담을수있게.
    $stacklist.droppable( {
        accept : '#blocklist div.blockitem',
        drop : function(evt, ui) {

            var cloneItem = $(ui.draggable).clone();
            var blockSeq = cloneItem.attr('data-blockSeq');
            var originalBlock = blockList[ blockSeq ];

            //--- DEEP COPY 위해서 새로운 객체 생성 ----
            var nBlock = new FBlock( originalBlock.bType, stackList.length );
            var nBlockQuery = nBlock.toHTML();
            nBlock.initTooltipInfo();
            nBlock.setButtonListen(true); // 버튼 작동 활성화

            //--- 스택에 추가 ---
            stackList.push( nBlock );

            //--- 스택 바구니에(뷰) 추가 ---
            appendItemToStack( nBlockQuery  );
            enableStackItemDraggable( nBlockQuery );
            stackListAutoHeight();

        }
    })

    /**
     * 스택리스트 높이 유동조절
     */
    function stackListAutoHeight() {

        var stackHandler = $('#stackHandler', $stacklist);
        var stackList = $('#stacklist');

        if (stackHandler.height() > stackList.height()) {
            stackList.height(
                stackHandler.height()
            );
        } else {
            if( stackHandler.height() > initStacklistHeight ) {
                stackList.height(
                    stackHandler.height()
                )
            }
        }


    }

    // 스택에있는거 버릴수있게.
    $blocklist.droppable( {
        accept : '#stacklist #stackHandler div',
        //activeClass : 'enableRemoveItem',
        drop : function(evt, ui) {

            // 중간 블럭 제거 방지.
            var currentStackSequence = parseInt(ui.draggable.attr('data-blockseq'));
            if( stackList.length != currentStackSequence+1) {
                BootstrapDialog.show({
                    type : BootstrapDialog.TYPE_WARNING,
                    title : 'Error !!',
                    message : '중간에 있는 블럭은 제거 할 수 없습니다. ',
                    buttons: [{
                        label: ' 닫기 ',
                        cssClass: 'btn-primary',
                        action: function(dialog){
                            dialog.close();
                        }
                    }]
                });
                return false;
            }

            ui.draggable.remove();
            stackList.pop();
            console.log( stackList );
            // 높이 조정 시작.
            stackListAutoHeight();

            $(document).trigger('removedBlock', {data : stackList});
        }
    })


    // 스택바구니에 추가
    function appendItemToStack( item ) {
        var $stackHandler = $('#stackHandler', $stacklist);

        if( $stackHandler.length == 0 ) {
            $stackHandler = $('<div />').attr('id','stackHandler').appendTo( $stacklist );
        }

        item.appendTo( $stackHandler );
    }

    // 스택에 들어온 아이템을 드래그할수있게 변경
    function enableStackItemDraggable( item ) {
        item.draggable({
            revert: "invalid",
            containment: "document",
            helper: "clone",
            cursor: "move"
        })
    }


    //---------------
    // 이벤트 처리 ---
    //---------------
    $(document).on('blockModified', function(e) {
        $(document).trigger('movedBlock', {data : stackList});
    });

    $(window).load( function() {

        //----------------------
        // 슬롯 데이터 복구
        //----------------------
        if( slotData ) {
            for(var i = 0; i < slotData.length; i++) {
                var blockItem = recoverBlockdata( slotData[i], i );
                if(!blockItem) continue;

                var html = blockItem.toHTML();
                blockItem.setButtonListen(true);
                blockItem.injectData( slotData[i].data );
                blockItem.initTooltipInfo();

                arrStackList.push( blockItem );
                appendItemToStack( html );
                enableStackItemDraggable( html );
            }
        }
        $(document).trigger('movedBlock', {data : arrStackList}); // 빈 이벤트
    })




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