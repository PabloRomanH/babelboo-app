#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");
var cursor = db.usercollection.find();

while (cursor.hasNext()){
    var user = cursor.next();
    var email = user.username;
    var nickname = email.split('@')[0];

    print(nickname);
    db.usercollection.update({_id: user._id}, {$set: {nickname: nickname}});
}

