
var google = require('googleapis');
var console = require('console');

youtube = google.youtube('v3');

var API_KEY = 'AIzaSyB53eOcfiDxRuIr-kakVIl1vIzBa9rQHD8';

if (process.argv.length < 3) {
	console.log('Missing parameter. Specify playlist id.');
	return;
}

playlistId = process.argv[2];

function getVideoIds(err, resp) {
	if(err) {
		console.log(err);
		return;
	}
	var nitems = resp.items.length;
	var videos = [];
	for(var i = 0; i < nitems; i++) {
		var video = {
			title: resp.items[i].snippet.title,
			id: resp.items[i].snippet.resourceId.videoId
		};
		videos.push(video);
		console.log(video.id);
	}

	if(resp.nextPageToken) {
		youtube.playlistItems.list({part:'snippet, id', maxResults:'50', playlistId:playlistId,
			pageToken: resp.nextPageToken, key:API_KEY}, getVideoIds);
	} else {
 		//console.log(JSON.stringify(videos,null,'    '));
 	}
}

youtube.playlistItems.list({part:'snippet, id', maxResults:'50', playlistId:playlistId, key:API_KEY}, getVideoIds);


