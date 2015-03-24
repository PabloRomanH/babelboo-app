#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"


var connection = new Mongo();
var db = connection.getDB("babelboo");

var map = function() {
    if (!this.medalhistory) {
        return;
    }

    for (index in this.medalhistory) {
        var history = this.medalhistory[index];

        if (history.date < nDaysAgo(14)) {
            continue;
        }

        emit(history.playlistid, 1);
    }

    function nDaysAgo(nDays) {
        var date = new Date();
        clearTime(date);
        date.setDate(date.getDate() - nDays);
        return date;
    }

    function clearTime(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }
};

var reduce = function(previous, current) {
    var count = 0;

    for (index in current) {
        count += current[index];
    }

    return count;
};

var result = db.runCommand({
mapreduce : "usercollection",
map : map,
reduce : reduce,
out : 'mostvisited'});

var cursor = db.mostvisited.find().sort({value: -1});

while (cursor.hasNext()){
    var elem = cursor.next();

    var playlist = db.playlists.findOne({_id: new ObjectId(elem._id)});

    if (playlist) {
        printjson({
            _id: playlist._id,
            title: playlist.title,
            views: elem.value
        });
    }

}
