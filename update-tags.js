#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("nodetest1");

var map = function() {
    if (!this.tags) {
        return;
    }

    for (index in this.tags) {
        emit(this.tags[index], 1);
    }
};

var reduce = function(previous, current) {
    var count = 0;

    for (index in current) {
        count += current[index];
    }

    return count;
};

print("Updating tag list");

var result = db.runCommand({
"mapreduce" : "playlists",
"map" : map,
"reduce" : reduce,
"out" : "tags"});

var cursor = db.tags.find();

while (cursor.hasNext()){
    printjson(cursor.next());
}
