
var express = require('express');

var router = express.Router();

router.post('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });


    res.status(201); // CREATED
    res.json();
});


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

router.post('/playlist/:playlist_id/increasevisitcount', function(req, res) {
    var playlistId = req.params.playlist_id;

    try {
        if (req.isAuthenticated() && !req.user.playlistprogress[playlistId].finished) {
            return;
        }
    } catch(err) {
        return;
    }

    var collection = req.db.get('playlists');
    var query = {
        _id: playlistId
    }

    collection.update(query, {$inc: {visitcount: 1}});
    res.json();
});

router.get('/video/:level?', function(req, res) {
    var level = req.params.level;
    var query = {};
    if (level) {
        query = { level: parseInt(level) };
    }

    var collection = req.db.get('videos');

    try {
        collection.find(query, {}, function (err, result) {
            res.json(result);
        });
    } catch (err2) {
        res.json();
    }
});

module.exports = router;
