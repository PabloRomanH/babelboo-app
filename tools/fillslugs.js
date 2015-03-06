#!/usr/bin/env node

var dbpath = 'localhost:27017/babelboo';

var db = require('monk')(dbpath);
var slug = require('slug');

var playlistsdb = db.get('playlists');
console.log('no me lo creo');


playlistsdb.find({}, function (err, result) {
    for (var i = 0; i < result.length; i++) {
        var playlist = result[i];

        if (playlist.slug) {
            console.log(result[i].title, 'already has a slug');
            continue;
        }

        updateWithIndex(playlist, 1);

        function updateWithIndex(playlist, index) {
            var titleSlug = slug(playlist.title);

            if (index > 1) {
                titleSlug = titleSlug + index;
            }

            playlistsdb.find({slug: titleSlug}, function (err, result) {
                if (result.length == 0) {
                    playlist.slug = titleSlug;

                    playlistsdb.update({"_id": playlist._id}, playlist,
                        function (err, doc) {
                            console.log('updated', playlist.title, 'with slug', playlist.slug);
                            if (err) throw err;
                        });
                } else {
                    setTimeout(updateWithIndex.bind(null, playlist, index+1), 0);
                }
            });
        }


    }
});
