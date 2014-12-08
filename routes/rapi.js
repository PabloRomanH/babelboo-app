

var express = require('express');

var router = express.Router();

router.get('/playlist', function(req, res) {
    var collection = req.db.get('playlists');

    var query = {};
    
    if (req.query.related) {
        query._id = req.query.related;
        collection.find(query,{},function (err, result) {
            var tags = result[0].tags;
            var i = tags.indexOf('american english');
            if (i != -1) {
                tags.splice(i, 1);
            }
            i = tags.indexOf('british english');
            if (i != -1) {
                tags.splice(i, 1);
            }
            collection.find({tags: { $in: tags }},{},function (err, result) {
                res.json(result);
            });
        });
    } else {
        if (req.query.tags) {
            query.tags = { $all : req.query.tags.split(',') };
        }
        
        if (req.query.level) {
            query.level = req.query.level;
        }
    
        try {
            collection.find(query,{},function (err, result) {
                res.json( result );
            });
        } catch (err2) {
            res.json();
        }
    }
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

/*router.get('/playlist/tag/:tag_name', function(req, res) {
    var collection = req.db.get('playlists');

    try {
        collection.find({tags: req.params.tag_name},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});*/

router.delete('/playlist/:playlist_id', function(req, res) {
    var collection = req.db.get('playlists');
    collection.remove({_id: req.params.playlist_id}); // FIXME return appropriate JSON in callback depending on success or failure
    res.status = 204;
    res.json();
});

router.put('/playlist/:playlist_id', function(req, res) {

    upsertPlaylist(req.body, req.params.playlist_id, req.db); // FIXME check format and return appropriate JSON in callback depending on success or failure

    res.status = 200; // OK
    res.json();
});

router.post('/playlist', function(req, res) {

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
    var collection = req.db.get('betaregistration');

    collection.insert(req.body,
        function (err, doc) {
            if (err) throw err;
        });

    
    res.status = 201; // CREATED
    res.json();
});

router.get('/betaregistration', function(req, res) {
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

router.get('/tag', function(req, res) {
    var collection = req.db.get('tags');

    try {
        collection.find({},{},function (err, result) {
            res.json( result );
        });
    } catch (err2) {
        res.json();
    }
});

router.get('/user', function(req, res) {
    var collection = req.db.get('usercollection');

    res.json(req.user);
});

router.post('/user/:username/answer/:playlist_id', function(req, res) {
    
    var playlist_id = req.params.playlist_id;
    var points = req.body.points;
    var found = false;
    
    var user = req.user;
    
    for (var i in user.playlist_points) {
        if (user.playlist_points[i].id == playlist_id) {
            user.playlist_points[i].points = Math.max(user.playlist_points[i].points, points);
            found = true;
        }
    }
    
    if (!found) {
        if(!user.playlist_points) {
            user.playlist_points = [];
        }
            
        user.playlist_points.push({'id': playlist_id, 'points': points});
    }
    
    var collection = req.db.get('usercollection');
    
    collection.update({ username: req.params.username }, 
        {$set: { 
            points: req.user.points + req.body.points,
            playlist_points: user.playlist_points
            }
        });
        
    
    res.json();
});


module.exports = router;
