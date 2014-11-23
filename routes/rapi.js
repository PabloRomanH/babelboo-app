
var youtube = require('googleapis').youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

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

router.put('/playlists/:playlist_id', function(req, res) {
    console.log ("PUT: ", req.body);

    upsertPlaylist(req.body, req.params.playlist_id, req.db);

    res.redirect('/playlists');
});

router.post('/playlists', function(req, res) {
    console.log ("POST: ", req.body);

    upsertPlaylist(req.body, null, req.db);

    res.redirect('/playlists');
});

/*{
    "title": "arare",
    "tags": [""],
    "videos": [
        {
            "source":"youtube",
            "id":"lW34GVACVSE",
            "question":"asd",
            "answers": [
                {
                    "text":"bc",
                    "iscorrect":false
                },
                {
                    "text":"nta",
                    "iscorrect":true
                }
            ]
        }
    ]
}*/


function upsertPlaylist(body, playlistId, db) {
    var collection = db.get('playlists');

    var playlistTitle = body.title;
    var tags = body.tags;

    var videoIds = body.videos.map(function(element) { return element.id; })
        .join(',');

    youtube.videos.list({part:'snippet,id,contentDetails', id:videoIds, key:API_KEY},
        function createPlaylist(err, resp) {
            var videos = [];
            for (var i = 0; i < resp.items.length; i++) {
                var id = resp.items[i].id;
                var duration = resp.items[i].contentDetails.duration;
                var title = resp.items[i].snippet.title;
                var thumbnail = resp.items[i].snippet.thumbnails.medium.url; // default/medium/high
                if (body.videos[i].question) {
                    var question = body.videos[i].question;
                    var answers = body.videos[i].answers;
                    videos.push({ source: "youtube", id: id, duration: duration, title: title, thumbnail: thumbnail, question: question, answers: answers });
                } else {
                    if (body.videos[i].question)
                    var question = body.videos[i].question;
                    var answers = body.videos[i].answers;
                    videos.push({ source: "youtube", id: id, duration: duration, title: title, thumbnail: thumbnail});
                }
            }

            if (playlistId) {
                collection.update({"_id": playlistId},{title: playlistTitle, entries:videos, tags:tags},
                    function (err, doc) {
                        if (err) throw err;
                    });
            } else {
                collection.insert({title: playlistTitle, entries:videos, tags:tags},
                    function (err, doc) {
                        if (err) throw err;
                    });
            }
        }
    );
}

module.exports = router;
