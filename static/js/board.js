//-------------------
// 게시판 VIEW
//-------------------

function sBoard() {
    this.tutorialSeq = 0;
    this.page = 1;
    this.countOffset = 10;
    this.data = null;

    this.parentArticle = [];
    this.childArticle = {};
    this.boardInfo = null;
    this.countOffset = 10; // 한페이지에 보여줄 게시물 갯수.
    this.blockOffset = 5; // 한페이지에 보여줄 페이지 블락 갯수.
}

sBoard.prototype.setTutorialSeq = function(tutorialSeq) {
    this.tutorialSeq = tutorialSeq;
    return this;
}

sBoard.prototype.setBoardPage = function(page) {
    this.page = page;
    return this;
}

sBoard.prototype.setBoard = function(tutorialSeq, page, countOffset) {
    this.setTutorialSeq(tutorialSeq);
    this.setBoardPage(page);
    this.countOffset = countOffset || 10;

    return this;
}

sBoard.prototype.retriveData = function() {

    var self = this;
    var bUrl = '/board/' + (this.tutorialSeq) + '/' + (this.page);
    var infoUrl = '/board/' + (this.tutorialSeq) + '/info';
    var bParam = {
        countOffset : this.countOffset,
    }

    /* 게시글 정보 가져오기 */
    urlReq.get( bUrl, bParam , function(result) {
        if( result.error ) {
            alert(' 에러가 발생하였습니다. ');
            return false;
        }

        /* 게시판 정보 가져오기 */
        urlReq.get(infoUrl, {}, function(infoResult) {
            if( infoResult.error ) {
                alert(' 에러가 발생하였습니다. ');
                console.log( infoResult );
                return false;
            }


            /* 데이터 주입 작업 */
            self.data = result.data;
            self.boardInfo = infoResult.data;

            self.refine();
            self.render();
            self.createPagination();
        })

    })

}

sBoard.prototype.refine = function() {
    var s = this.data;


    for(var i = 0; i < s.length; i++) {
        var item = s[i];

        if( item.seq == item.parentSeq ) { // 부모글 이라면.
            this.parentArticle.push( item );
        }
        // 부모글이 아니라면 자식글로 append
        else {
            if( !this.childArticle.hasOwnProperty( item.parentSeq ) ) {
                this.childArticle[ item.parentSeq ] = [];
                this.childArticle[ item.parentSeq].push(item);
            }
            else {
                this.childArticle[ item.parentSeq].push(item);
            }
        }
    }

}
/**
 * 게시판 글 렌더링.
 */
sBoard.prototype.render = function() {
    for( var key in this.parentArticle ) {
        var parentSeq = this.parentArticle[key].seq;

        // -- append parent --
        this.parentArticle[key].regdate = dateNormalize(this.parentArticle[key].cregdate);

        $('#parentList').tmpl( this.parentArticle[key] ).appendTo( $('.panel-group'));


        //-- append child --
        if( this.childArticle.hasOwnProperty(parentSeq) ) {
            for( var i = 0; i < this.childArticle[parentSeq].length; i++) {
                 this.childArticle[parentSeq][i].regdate = dateNormalize(this.childArticle[parentSeq][i].cregdate);
                 $('#childList').tmpl( this.childArticle[parentSeq][i] ).appendTo( $('#collapse'+parentSeq+' .panel-body') );
            }
        }

        // badge 갯수 업데이트
        var countComment = (this.childArticle.hasOwnProperty(parentSeq)) ? this.childArticle[parentSeq].length : 0;
        $('#parentCollapse'+parentSeq+ ' span.badge').html( countComment );
    }

    //-- 모든 작업이 끝나면 아코디언을 닫은 상태로 바꾼다 --
    $('button[data-seq][data-handleMode="newreply"]').click( function(e) {
        var dataSeq = $(this).attr('data-seq');

        $('#replyArticleModal h4 span').html('#' + dataSeq );
        $('#replyArticleModal').attr('data-parentSeq', $(this).attr('data-seq') );

        $('#replyArticleModal').modal({
           keyboard: false,
           backdrop: 'static',
           show: true,
        });
    })

    $('button[data-seq][data-handleMode="remove"]').click( function(e) {
        var current = $(this);

        if( !confirm( current.attr('data-seq') + ' 게시글을 정말로 삭제하시겠습니까? ') ) return false;

        urlReq.delete('/board/' + current.attr('data-seq'), {}, function(result) {
            if( result.error ) {
                alert( result.data );
                return false;
            }
            else {
                alert( current.attr('data-seq') + ' 게시글이 정상적으로 삭제되었습니다.');
                window.location.reload();
            }
        })
    })

}

sBoard.prototype.writeArticle = function(tid) {
    var articleContent = $('#newArticleContent');

    if( articleContent.val().trim().length == 0 ) {
        alert(' 내용을 작성하셔야 합니다. ');
        articleContent.focus();
        return false;
    }

    var sParam = {
        parentSeq : -1,
        tid : tid,
        content : articleContent.val().trim(),
    }

    urlReq.post('/board/'+tid, sParam, function(result) {
        if( result.error ) {
            alert(' 질문 작성 도중 에러가 발생하였습니다. ');
            console.log( result.data );
            return false;
        }
        alert(' 질문을 등록하였습니다. ');
        window.location.reload();
    })

}

sBoard.prototype.writeReplyArticle = function(tid) {

    var articleContent = $('#replyArticleModal .modal-body textarea');
    var parentSeq = parseInt( $('#reply'))

    if( articleContent.val().trim().length == 0 ) {
        alert(' 내용을 작성하셔야 합니다. ');
        articleContent.focus();
        return false;
    }

    var sParam = {
        parentSeq : $('#replyArticleModal').attr('data-parentSeq'),
        tid : tid,
        content : articleContent.val().trim(),
    }

    urlReq.post('/board/'+tid, sParam, function(result) {
        if( result.error ) {
            alert(' 답변 작성 도중 에러가 발생하였습니다. ');
            console.log( result.data );
            return false;
        }
        alert(' 답변을 등록하였습니다. ');
        window.location.reload();
    })

}

sBoard.prototype.createPagination = function() {
    var totalArticle = this.boardInfo.parentCount;
    var numPages = Math.ceil( 1.0 * totalArticle / this.countOffset );
    var numBlocks = Math.ceil( numPages / this.blockOffset );
    var sPath =  window.location.pathname + '?page=';


    // 현재페이지의 속한 블락 구간을 구함.
    var currentBlock = parseInt( Math.ceil( this.page / this.blockOffset ) );

    // 현재 블락의 시작페이지 구함.
    var currentBlockStartPage = (currentBlock -1) * this.blockOffset + 1;

    var html = '';
    if( this.page == 1 ) {
        html += '<li><a href="#">«</a></li>';
    }
    else {
        html += '<li><a href="'+(sPath + (this.page-1))+'">«</a></li>';
    }
    for( var i = 0; i < this.blockOffset; i++) {

        /* 마지막 페이지보다 페이지 계산이 더 커버리면 중단 */
        if( ( currentBlockStartPage + i ) > numPages ) {
            break;
        }

        if( i+ currentBlockStartPage == this.page ) {
            html += '<li class="active"><a href="#">'+(i+currentBlockStartPage)+'</a></li>';
        }
        else {
            html += '<li><a href="'+(sPath + (i+currentBlockStartPage))+'">'+(i+currentBlockStartPage)+'</a></li>';
        }

    }
    if( this.page == numPages ) {
        html += '<li><a href="#">»</a></li>';
    }
    else {
        html += '<li><a href="'+(sPath + (this.page+1))+'">»</a></li>';
    }

    $('#sPagination ul').append(html);
}

