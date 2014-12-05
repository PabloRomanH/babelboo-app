

var express = require('express');

var router = express.Router();

router.get('/playlist', function(req, res) {
    console.log ("GET: ", req.body);
    var collection = req.db.get('playlists');

    try {
        collection.find({},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});

router.get('/playlist/:playlist_id', function(req, res) {
    console.log ("GET: ", req.body);
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
    console.log ("DELETE: ", req.body);
    var collection = req.db.get('playlists');
    collection.remove({_id: req.params.playlist_id}); // FIXME return appropriate JSON in callback depending on success or failure
    res.status = 204;
    res.json();
});

router.put('/playlist/:playlist_id', function(req, res) {
    console.log ("PUT: ", req.body);

    upsertPlaylist(req.body, req.params.playlist_id, req.db); // FIXME check format and return appropriate JSON in callback depending on success or failure

    res.status = 200; // OK
    res.json();
});

router.post('/playlist', function(req, res) {
    console.log ("POST: ", req.body);

    upsertPlaylist(req.body, null, req.db); // FIXME check format and return appropriate JSON in callback depending on success or failure

    res.status = 201; // CREATED
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

router.post('/betaregistration', function(req, res) {
    console.log ("POST: ", req.body);
    var collection = req.db.get('betaregistration');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });

    
    res.status = 201; // CREATED
    res.json();
});

router.get('/betaregistration', function(req, res) {
    console.log ("API GET: ", req.body);
    if (req.query.PASSWORD != "XHxaXmc8Ev2FzG8M6lel") {
        res.status = 404;
        res.json();
        return;
    }
        
    var collection = req.db.get('betaregistration');

    try {
        collection.find({},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});


module.exports = router;
