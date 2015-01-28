/**
 * 게시판 컨트롤러
 * @type {utility|exports}
 */

var u = require('../Util');
var boardService = require('../service/boardSvc');

var controller = {

    getArticleList : function(req, res) {
        console.log( req.page );
        console.log( req.tid );
    },

    postArticle : function(req, res) {

    },

    removeArticle : function(req, res) {

    },

    modifyArticle : function(req, res) {

    },

}


/* EXPORT */
module.exports = controller;