

var controller = {

    view : function(req, res) {
        var sess = req.session;
        var opt = {
            extraJS : [
                'freedraw/processing.js', 'freedraw/FBlock.js', 'freedraw/FMoveblock.js', 'freedraw/freedraw.js'
            ],
            extraCSS : ['freedraw.css'],
            member : sess.member
        };
        res.render('freedraw', opt);
    }
}


/* EXPORT */
module.exports = controller;