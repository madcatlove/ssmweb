/**
 * Created by Lee on 2015-02-07.
 */

var u = require('../Util');
var galleryService = require('../service/gallerySvc');

var async = require('async');

var controller = {
    view : function(req, res) {
        var page = req.query.page;
        if( !page ) page = 1;
        var sess = req.session;


        var opt = {
            extraJS : [],
            extraCSS : [],
            member : sess.member
        };

        res.render('gallery', opt);
    }
}

/* EXPORT */
module.exports = controller;