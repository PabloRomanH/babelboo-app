

var express = require('express');

var router = express.Router();

router.delete('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');
    collection.remove({_id: req.params.playlist_id}); // FIXME return appropriate JSON in callback depending on success or failure
    res.status(204);
    res.json();
});

router.put('/playlist/:playlist_id', function(req, res) {
    upsertPlaylist(req.body, req.params.playlist_id, req.db); // FIXME check format and return appropriate JSON in callback depending on success or failure

    res.status(200); // OK
    res.json();
});

router.post('/playlist', function(req, res) {
    upsertPlaylist(req.body, null, req.db); // FIXME check format and return appropriate JSON in callback depending on success or failure

    res.status(201); // CREATED
    res.json();
});

function upsertPlaylist(body, playlistId, db) {
    var collection = db.get('playlists');

    // TODO verify format and permissions of request
    if (playlistId) {
        collection.update({"_id": playlistId}, body,
            function (err, doc) {
                if (err) throw err;
            });
    } else {
        collection.insert(body,
            function (err, doc) {
                if (err) throw err;
            });
    }
}

router.post('/video', function(req, res) {
    var collection = db.get('videos');
    console.log('asking for videos');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });

    res.status(201); // CREATED
    res.json(req.body);
});

router.get('/betaregistration', function(req, res) {
    var collection = req.db.get('betaregistration');

    try {
        collection.find({},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});

router.get('/adduser/:username', function(req, res, next) {
    var collection = req.db.get('usercollection');
    var query = {};
    var err;

    if(req.params.username.length === 0) {
        err = new Error('Username cannot be empty.');
        err.status = 400; // bad request
        next(err);
        return;
    }

    query.username = req.params.username;
    query.lastvisit = new Date();
    query.daysvisited = 0;
    query.password = "";
    query.points = 0;
    query.playlist_points = [];
    query.abtesting = { questionsatend: false, ninegag: true };

    collection.find({ username: req.params.username },{},function (err, result) {
        if (result.length !== 0) {
            err = new Error('User already exists.');
            err.status = 400; // bad request
            next(err);
            return;
        }

        collection.insert(query, function (err, doc) {
            if (err) throw err;

            res.status(201); // CREATED
            res.send('<html><body>User correctly created.</body></html>');
        });
    });
});

module.exports = router;
