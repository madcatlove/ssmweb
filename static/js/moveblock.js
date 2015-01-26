/**
 * Created by madcat on 1/26/15.
 */

$(document).ready( function() {

    var $stack = $('#blocklist'),
        $trash = $('#stacklist');


    //------------
    // item 움직일수 있게.
    $( 'div.blockitem' , $stack ).draggable({
        //cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
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
            console.log( event, ui );
            trashAppend(ui.draggable );
        }
    })


    //-------------
    // item 에 떨굴수 있게.
    $stack.droppable( {
        accept: '#stacklist ul div',
        activeClass : 'stackCanDrop',
        drop : function( event, ui ) {
            console.log( $(this ))
            stackAppend( ui.draggable );
        }
    })


    var trashAppend = function(item) {
        var $handler = ( $('ul', $trash).length ) ? $('ul', $trash) : $("<ul />").appendTo($trash);

        item.appendTo( $handler );
    }

    var stackAppend = function(item) {

        item.appendTo( $stack );
    }


});