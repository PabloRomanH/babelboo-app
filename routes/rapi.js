var express = require('express');

var router = express.Router();

router.get('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');

    try {
        collection.find({_id: req.params.playlist_id},{},function (err, result) {
            res.json( result[0] );
        });
    } catch (err2) {
        res.json();
    }
});

router.delete('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');
    collection.remove({_id: req.params.playlist_id});
});

module.exports = router;
