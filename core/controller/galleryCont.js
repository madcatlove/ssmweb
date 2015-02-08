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

            extraJS : [ 'freeDraw/FBlock.js', 'freeDraw/processing.js', 'gallery.js', 'fotorama.js'],
            extraCSS : [ 'fotorama.css'],
            member : sess.member
        };

        res.render('gallery', opt);
    },

    galleryList : function(req, res) {
        var page = parseInt(req.query.page || 1);

        var sParam = {
            page : page,
            countOffset : 0
        }

        galleryService.getGallery( sParam, function(result) {
            res.json(u.result( result ) );
        })

    }
}

/* EXPORT */
module.exports = controller;