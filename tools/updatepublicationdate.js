#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");
var cursor = db.playlists.find();

while (cursor.hasNext()){
    var playlist = cursor.next();
    var publicationDate = playlist._id.getTimestamp();
    db.playlists.update({_id: playlist._id}, {$set: {publicationdate: publicationDate}});
    print('set', publicationDate, 'for list', playlist.slug);
}
