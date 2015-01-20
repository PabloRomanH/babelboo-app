#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");

var cursor = db.playlists.find();

while (cursor.hasNext()){
    var playlist = cursor.next();

    var newtags = playlist.tags.filter(noUsUk);

    db.playlists.update({_id: playlist._id}, {$set: {tags: newtags}});
}

function noUsUk(parm) {
    if (parm == 'american english') {
        return false;
    }

    if (parm == 'british english') {
        return false;
    }

    return true;
}