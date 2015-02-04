
var express = require('express');

var router = express.Router();

router.post('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    if (req.body.email == undefined) {
        res.status(406);
        res.json({ error: { message: 'Invalid request', code: 406 }});
        return;
    }

    collection.insert({ email: req.body.email },
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
            if (result.length < 1) {
                res.status(404);
                res.json({ error: { message: 'Not found', code: 404 }});
            } else {
                res.json( result[0] );
            }
        });
    } catch (err) {
        res.status(500);
        res.json({ error: { message: 'Internal server error', code: 500 }});
        return;
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
