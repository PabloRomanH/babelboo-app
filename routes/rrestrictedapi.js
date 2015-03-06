

var express = require('express');
var slug = require('slug');
var router = express.Router();

router.delete('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');
    collection.remove({_id: req.params.playlist_id}); // FIXME return appropriate JSON in callback depending on success or failure
    res.status(204);
    res.json();
});

router.put('/playlist/:playlist_id', function(req, res) {
    upsertPlaylist(req.body, req.params.playlist_id, req.db, function (err) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json();
        }
    }); // FIXME check format and return appropriate JSON in callback depending on success or failure
});

router.post('/playlist', function(req, res) {
    upsertPlaylist(req.body, null, req.db, function (err) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(201);
            res.json();
        }
    }); // FIXME check format and return appropriate JSON in callback depending on success or failure
});

function upsertPlaylist(playlist, playlistId, db, callback) {
    var collection = db.get('playlists');

    // TODO verify format and permissions of request
    if (playlistId) {
        collection.update({"_id": playlistId}, playlist,
            function (err, doc) {
                callback(err);
            });
    } else {
        insertWithIndex(1);

        function insertWithIndex(index) {
            var titleSlug = slug(playlist.title);

            if (index > 1) {
                titleSlug = titleSlug + index;
            }

            collection.find({slug: titleSlug}, function (err, result) {
                if (result.length == 0) {
                    playlist.slug = titleSlug;

                    collection.insert(playlist,
                        function (err, doc) {
                            callback(err);
                        });

                } else {
                    setTimeout(insertWithIndex.bind(null, index+1), 0);
                }
            });
        }
    }
}

router.post('/video', function(req, res) {
    var collection = req.db.get('videos');

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
    query.nickname = query.username.split('@')[0];
    query.daysvisited = 0;
    query.password = "";
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
