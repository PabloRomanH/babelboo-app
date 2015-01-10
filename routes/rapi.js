
var express = require('express');

var router = express.Router();

router.get('/playlist', function(req, res) {
    var collection = req.db.get('playlists');

    var query = {};

    if (req.query.level && req.query.level != -1) {
        query.level = parseInt(req.query.level);
    }

    if (req.query.tags) {
        query.tags = { $all : req.query.tags.split(',') };
    }

    if (req.query.related) {
        collection.find({ _id: req.query.related },{},function (err, result) {
            var tags = result[0].tags;
            var i = tags.indexOf('american english');
            if (i != -1) {
                tags.splice(i, 1);
            }
            i = tags.indexOf('british english');
            if (i != -1) {
                tags.splice(i, 1);
            }
            query._id = { $ne: collection.id(req.query.related) };
            query.tags = { $in: tags };
            runQuery(query);
        });
    } else if (req.query.all == 'true') {
        runQueryAll(query);
    } else {
        runQuery(query);
    }

    function runQueryAll (query) {
        try {
            collection.find(query, function (err, result) {
                res.json( result );
            });
        } catch (err2) {
            res.json();
        }
    }

    function runQuery (query) {
        try {
            collection.find(query, function (err, result) {
                for (var i = 0; i < result.length; i++) {
                    var current = result[i];
                    var newentries = [];
                    for (var j = 0; j < current.entries.length && j < 4; j++) {
                        var newvid = {};
                        newvid.thumbnail = current.entries[j].thumbnail;
                        newentries[j] = newvid;
                    }

                    current.entries = newentries;
                }
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

router.post('/user/:username/correctanswer/:playlist_id', function(req, res) {
    if (req.params.username != req.user.username) {
        res.status(403); // FORBIDDEN
        res.json();
        return;
    }
    var collection = req.db.get('usercollection');

    var videoId = req.body.id;

    var query = {
        username: req.user.username
    };

    var setop = {};
    setop['playlistprogress.' + req.params.playlist_id + '.correct.' + videoId] = true;
    setop['playlistprogress.' + req.params.playlist_id + '.ratio'] = req.body.ratio;

    collection.update(query, {$set: setop});

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

router.post('/video', function(req, res) {
    var collection = req.db.get('videos');

    var videoIds = req.body;
    var videos = videoIds.map(function (currentValue) {
        return {
            videoId: currentValue.id,
            title: currentValue.title,
            level: currentValue.level,
            source: 'YouTube'
        }
    });

    for (var i = 0; i < videoIds.length; i++) {
        collection.insert(videos);
    }

    res.json();
});

module.exports = router;
