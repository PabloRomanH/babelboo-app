#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");
var cursor = db.usercollection.find({}, {nickname: true, medalhistory: true});

while (cursor.hasNext()) {
    var user = cursor.next();
    if (!user.medalhistory || !user.medalhistory.length) {
        continue;
    }

    print(user.nickname);

    for (var i in user.medalhistory) {
        var playlistId = user.medalhistory[i].playlistid;
        var date = user.medalhistory[i].date;

        var playlist = db.playlists.findOne({_id: ObjectId(playlistId)}, {slug: true});

        print('\t', date, playlist.slug);
    }
}
