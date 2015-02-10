/**
 * Drag & Drop Block Lists implements
 * @type {*|jQuery|HTMLElement}
 */

function dragDropBlockList() {
    this.$source = $('#blocklist'); // 블락이 처음 초기화될곳
    this.$dest = $('#stacklist'); // 블락이 옮겨질 스택 바구니.
    this.blocklist = []; // 블락 리스트.
    this.movedlist = []; // 스택리스트로 움직인 리스트.
}

/**
 * BlockList 에 블락을 추가함.
 * @param block
 */
dragDropBlockList.prototype.append = function( block ) {
    this.blocklist.push(block);

}

/**
 * View 에 보여주기 위하여 추가된 Block 를 HTML 화 하여 $source 에 추가함.
 */
dragDropBlockList.prototype.init = function() {
    for(var i = 0; i < this.blocklist.length; i++) {
        this.$source.append( this.blocklist[i].toHTML() );
    }

    $(document).ready( function() {
        $('.input').bind('click', function(e) {
           $(this).focus();
        });
    })
}

/**
 * 스택바구니에 옮겨진 블락들을 JSON 데이터로 추출.
 * @returns {Array}
 */
dragDropBlockList.prototype.blocksToJSON = function() {
    var data = [];

    for(var i = 0; i < this.movedlist.length; i++) {
        data.push( this.movedlist[i].toJSON() );
    }

    return data;
}

/**
 * 블락 고유번호( blockType 아님 ) 으로 블락 객체 Object 를 가져옴.
 * @param seq
 * @returns {*}
 */
dragDropBlockList.prototype.getBlockBySeq = function(seq) {
    for( var t = 0; t < this.blocklist.length; t++) {
        if( this.blocklist[t].blockSeq == seq ) {
            return this.blocklist[t];
        }
    }

    return {};
}

/**
 * 블락 Drag & Drop 구현을 위해 이벤트 리스너 등록.
 */
dragDropBlockList.prototype.eventRun = function() {
    var $stack = this.$source,
        $trash = this.$dest;
    var _self = this;

    //------------
    // item 움직일수 있게.
    $( 'div.blockitem' , $stack ).draggable({
        revert: "invalid",
        containment: "document",
        helper: "clone",
        cursor: "move"
    });

    //-------------
    // trash 에 떨굴수 있게.
    $trash.droppable( {
        accept: '#blocklist > div',
        activeClass : 'trashCanDrop',
        drop : function( event, ui ) {
            var blockSeq = ui.draggable.attr('data-blockseq');
            _self.movedlist.push( _self.getBlockBySeq( blockSeq ) );
            ui.draggable.attr('data-isstacked', '1');
            trashAppend(ui.draggable );


            /* 이벤트 발생 */
            $(document).trigger('movedEvent', { movedlist : _self.movedlist });
        }
    })


    //-------------
    // item 에 떨굴수 있게.
    $stack.droppable( {
        accept: '#stacklist div div',
        activeClass : 'stackCanDrop',
        drop : function( event, ui ) {

            var blockSeq = ui.draggable.attr('data-blockseq');

            // 현재 위치 다음번에 빼낼것이 있다면 에러.
            var t = 0;
            for(t = 0; t < _self.movedlist.length; t++) {
                if( _self.movedlist[t].blockSeq == blockSeq ) {
                    break;
                }
            }

            if( t+1 != _self.movedlist.length ) {
                alert(' 중간 블럭을 뺄 수 없습니다. ');
                return false;
            }
            _self.movedlist.pop();

            ui.draggable.attr('data-isstacked', '0');
            stackAppend( ui.draggable );

            /* 이벤트 발생 */
            $(document).trigger('removedEvent');
            $(document).trigger('movedEvent', { movedlist : _self.movedlist });

        }
    })


    var trashAppend = function(item) {
        var blist = $('#blocklist').width();
        var $handler = ( $('div', $trash).length ) ? $('div', $trash).eq(0) : $("<div />").css({
            'display' : 'inline-block',
            'width' : (blist+10) + 'px'
        }).addClass('text-left').appendTo($trash);


        item.appendTo( $handler );
    }

    var stackAppend = function(item) {
        item.appendTo( $stack );
    }
}
