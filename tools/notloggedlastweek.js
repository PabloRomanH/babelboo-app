#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");

var lastweek = new Date();
var lastmonth = new Date();
lastweek.setDate(lastweek.getDate() - 7);
lastmonth.setDate(lastmonth.getMonth() - 1);

var cursor = db.usercollection.find({lastvisit: {$lt: lastweek, $gt: lastmonth}});

while (cursor.hasNext()){
    var user = cursor.next();
    print(user.lastvisit.toISOString(), user.username);
}

print('');

cursor = db.usercollection.find({lastvisit: {$lt: lastweek, $gt: lastmonth}});

while (cursor.hasNext()){
    var user = cursor.next();
    print(user.username);
}
