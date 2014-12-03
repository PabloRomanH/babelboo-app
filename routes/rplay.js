var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var playlistId = req.param('id');
    res.render('play', {playlistId: playlistId} );
});


module.exports = router;
