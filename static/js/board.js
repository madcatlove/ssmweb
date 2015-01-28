//-------------------
// 게시판 VIEW
//-------------------

function sBoard() {
    this.tutorialSeq = 0;
    this.page = 1;
    this.countOffset = 10;
    this.data = null;

    this.parentArticle = {}
    this.childArticle = {}
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

    urlReq.get( bUrl, {}, function(result) {
        if( result.error ) {
            alert(' 에러가 발생하였습니다. ');
            return false;
        }
        self.data = result.data;
        console.log(self.data);

        self.refine();
        self.render();
    })

}

sBoard.prototype.refine = function() {
    var s = this.data;

    for(var i = 0; i < s.length; i++) {
        var item = s[i];

        if( item.seq == item.parentSeq ) { // 부모글 이라면.
            if( !this.parentArticle.hasOwnProperty( item.seq) ) {
                this.parentArticle[item.seq] = item;
            }
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

    console.log( this.parentArticle );
    console.log( this.childArticle );
}

sBoard.prototype.render = function() {
    for( var key in this.parentArticle ) {
        // -- append parent --
        $('#parentList').tmpl( this.parentArticle[key] ).appendTo( $('.panel-group'));


        //-- append child --
        if( this.childArticle.hasOwnProperty(key) ) {
            for( var i = 0; i < this.childArticle[key].length; i++) {
                 $('#childList').tmpl( this.childArticle[key][i] ).appendTo( $('#collapse'+key+' .panel-body') );
            }
        }

        // badge 갯수 업데이트
        var countComment = (this.childArticle.hasOwnProperty(key)) ? this.childArticle[key].length : 0;
        $('#parentCollapse'+key+ ' span.badge').html( countComment );
    }

    //-- 모든 작업이 끝나면 아코디언을 닫은 상태로 바꾼다 --
    $('button[data-seq]').click( function(e) {
        var dataSeq = $(this).attr('data-seq');

        $('#replyArticleModal h4 span').html('#' + dataSeq );

        $('#replyArticleModal').modal({
           keyboard: false,
           backdrop: 'static',
           show: true,
        });
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
        parentSeq : ,
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

