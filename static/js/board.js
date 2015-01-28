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
