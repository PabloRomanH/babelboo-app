#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");

var cursor = db.usercollection.find();

while (cursor.hasNext()){
    var user = cursor.next();
    print(user.username);

    var playlistProgress = {};
    var added = false;

    try {
        for (var i = 0; i < user.playlist_points.length; i++) {
            var playlistId = user.playlist_points[i].id;
            var points = user.playlist_points[i].points;
            var nvideos = (points % 100) / 10;
            var ncorrect = Math.floor(points / 100);
            print("Videos: " + nvideos + ", correct: " + ncorrect);

            var cursor2 = db.playlists.find({_id: new ObjectId(playlistId)});
            if (!cursor2.hasNext()) {
                print("Playlist doesn't exist: " + playlistId);
                continue;
            }

            var pl = cursor2.next();

            correct = {};
            if (ncorrect == nvideos) {
                for (var j = 0; j < pl.entries.length; j++) {
                    correct[pl.entries[j].id] = true;
                }
                playlistProgress[playlistId] = {
                    correct: correct,
                    ratio: 1
                }
                added = true;
            } else if (ncorrect > 0) {
                playlistProgress[playlistId] = {
                    correct: {},
                    ratio: 0.1
                }
                added = true;
            }
        }
        if (added) {
            print("Adding: ");
            printjson(playlistProgress);
            print(db.usercollection.update({username: user.username}, {$set: {playlistprogress: playlistProgress}}));
        }
    } catch (err) {}
}

