var express = require('express');
var passport = require('passport');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
//    if (!req.user) res.redirect('/login');
    var playlistId = req.param('id');
    res.render('play', {layout:'layoutyoutube', playlistId: playlistId} );
});


module.exports = router;
