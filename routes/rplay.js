var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var playlistId = req.param('id');
    res.render('play', {layout:'layoutyoutube', playlistId: playlistId} );
});


module.exports = router;
