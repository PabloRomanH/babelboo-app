var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    var collection = req.db.get('playlists');
    collection.find({},{},function (err, result) {
        res.render('allPlaylists', { message: req.flash('playlistCreated'), playlists: result });
    });
});


module.exports = router;