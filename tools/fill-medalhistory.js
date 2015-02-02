#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var BEGINNING = new Date ('2015-01-21');

var connection = new Mongo();
var db = connection.getDB("babelboo");

var cursor = db.usercollection.find();

while (cursor.hasNext()){
    var user = cursor.next();
    print(user.username);

    for (playlistId in user.playlistprogress) {
        var found = false;
        for (var i = 0; user.medalhistory && i < user.medalhistory.length; i++) {
            if (user.medalhistory[i].playlistid == playlistId) {
                found = true;
                break;
            }
        }

        if(!found) {
            var newMedal = {
                playlistid: playlistId,
                medal: getMedal(user.playlistprogress[playlistId].ratio),
                date: BEGINNING
            };

            db.usercollection.update({_id: user._id}, {$push: { medalhistory: newMedal }})
        }

    }
}


function getMedal(ratio) {
    var BRONZE = 1;
    var SILVER = 2;
    var GOLD = 3;

    print('getMedal ' + ratio);
    if (0 < ratio && ratio <= 0.5) {
        return BRONZE;
    } else if (0.5 < ratio && ratio < 1) {
        return SILVER;
    } else {
        return GOLD;
    }
}