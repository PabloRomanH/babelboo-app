#!/bin/sh
':' //; exec "$(command -v mongo)" "$0" "$@"

var connection = new Mongo();
var db = connection.getDB("babelboo");

var object = {
	'54a692cca5606f354096a9e4': 8,
	'548179471249b9630cbedcf9': 6,
	'548aca463ab14465415c88fe': 6,
	'548b130b3ab14465415c8901': 6,
	'54b28515a5606f354096a9f1': 6,
	'54b793eda5606f354096a9f4': 6,
	'54a692cca5606f354096a9e4': 5,
	'548af9643ab14465415c8900': 4,
	'549ed506a5606f354096a9d6': 4,
	'54aab86ba5606f354096a9eb': 4,
	'54b178f1a5606f354096a9f0': 4,
	'54a087a4a5606f354096a9db': 3,
	'54ad870ca5606f354096a9ec': 3,
	'54805ac91249b9630cbedcf3': 2,
	'5484980e8242fde5720482da': 2,
	'548a2bd93ab14465415c88fd': 2,
	'548aeaa83ab14465415c88ff': 2,
	'549fe7daa5606f354096a9da': 2,
	'54a534d5a5606f354096a9e1': 2
};

for (var key in object) {
    db.playlists.update({_id: new ObjectId(key)}, {$set: {visitcount: object[key]}});
}