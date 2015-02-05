
function initMoveBlock( blockList, stackList ) {

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

            nBlock.setButtonListen(true); // 버튼 작동 활성화

            //--- 스택에 추가 ---
            stackList.push( nBlock );

            //--- 스택 바구니에(뷰) 추가 ---
            appendItemToStack( nBlockQuery  );
            enableStackItemDraggable( nBlockQuery );

        }
    })

    // 스택에있는거 버릴수있게.
    $blocklist.droppable( {
        accept : '#stacklist #stackHandler div',
        //activeClass : 'enableRemoveItem',
        drop : function(evt, ui) {

            ui.draggable.remove();
            stackList.pop();
            console.log( stackList );
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
            cursor: "move",

            /*start : function() {
                //$('#blocklist').css('display','none');
                $('#blocklist_overlay').css('display','block');
            },

            stop : function() {
                $('#blocklist_overlay').css('display','none');
            } */
        })
    }


    //---------------
    // 이벤트 처리 ---
    //---------------
    $(document).on('blockModified', function(e) {
        $(document).trigger('movedBlock', {data : stackList});
    });

    $(window).load( function() {
        $(document).trigger('movedBlock', {data : []}); // 빈 이벤트
    })




}