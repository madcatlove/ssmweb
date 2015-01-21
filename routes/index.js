var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.name = '1234';
  console.log(req.session);

  res.send('test hello ');
});

router.get('/test', function(req, res, next) {
  console.log( req.session );
  res.send( req.session.name );

});

module.exports = router;
