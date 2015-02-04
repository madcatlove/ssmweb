
var u = require('../Util');
var async = require('async');

var tutorialService = require('../service/tutorialSvc');


var controller = {

    index : function(req, res) {
        var memberSession= req.session.member;
        var opt = {
            extraJS: [],
            member: memberSession
        }

        async.parallel(
        {
            tutorialChapterList : function( _callback) {
                tutorialService.getTutorialChapterList( function(result) {
                    _callback( null, result );
                })
            },



        },
            // 최종 콜백
            function finalExec(err, result) {

                for( var o in result ) {
                    opt[o] = result[o];
                }
                res.render('index', opt);
            }

        );


    }

}


/* EXPORT */
module.exports = controller;